import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const uploadDir = path.join(root, "public", "uploads");
const dataFile = path.join(root, "data", "portfolio.json");
const imageExtensions = new Set([".png", ".jpg", ".jpeg"]);
const maxWidth = Number(process.env.SOURCE_IMAGE_MAX_WIDTH || 1600);
const webpQuality = Number(process.env.SOURCE_WEBP_QUALITY || 74);
const minSavingsRatio = Number(process.env.SOURCE_IMAGE_MIN_SAVINGS || 0.12);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(target));
    } else if (entry.isFile()) {
      files.push(target);
    }
  }

  return files;
}

function uploadPath(filePath) {
  return `/uploads/${path.basename(filePath)}`;
}

async function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase();
  const target = file.slice(0, -ext.length) + ".webp";
  const sourceStat = await fs.stat(file);

  await sharp(file, { animated: false })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: webpQuality, effort: 5 })
    .toFile(target);

  const targetStat = await fs.stat(target);
  const savingsRatio = 1 - targetStat.size / sourceStat.size;

  if (targetStat.size < sourceStat.size && savingsRatio >= minSavingsRatio) {
    await fs.rm(file);
    return {
      from: uploadPath(file),
      to: uploadPath(target),
      saved: sourceStat.size - targetStat.size,
    };
  }

  await fs.rm(target);
  return null;
}

async function main() {
  const files = await walk(uploadDir);
  const images = files.filter((file) => imageExtensions.has(path.extname(file).toLowerCase()));
  const replacements = [];
  let savedBytes = 0;

  for (const image of images) {
    const result = await optimizeImage(image);
    if (!result) continue;
    replacements.push([result.from, result.to]);
    savedBytes += result.saved;
    console.log(`${result.from} -> ${result.to}`);
  }

  if (replacements.length > 0) {
    let data = await fs.readFile(dataFile, "utf-8");
    for (const [from, to] of replacements) {
      data = data.split(from).join(to);
    }
    await fs.writeFile(dataFile, data, "utf-8");
  }

  console.log(`Optimized ${replacements.length} images.`);
  console.log(`Saved ${(savedBytes / 1024 / 1024).toFixed(1)}MB.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
