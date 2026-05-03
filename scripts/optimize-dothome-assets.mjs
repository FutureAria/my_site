import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "dist", "dothome");
const uploadDir = path.join(outputDir, "uploads");
const webpQuality = Number(process.env.DOTHOME_WEBP_QUALITY || 78);
const maxWidth = Number(process.env.DOTHOME_IMAGE_MAX_WIDTH || 1800);
const minSavingsRatio = Number(process.env.DOTHOME_IMAGE_MIN_SAVINGS || 0.08);
const imageExtensions = new Set([".png", ".jpg", ".jpeg"]);
const textExtensions = new Set([".html", ".js", ".json", ".css", ".txt", ".xml", ".php"]);

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

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

function publicPath(filePath) {
  return `/${path.relative(outputDir, filePath).split(path.sep).join("/")}`;
}

async function replaceReferences(replacements) {
  if (replacements.length === 0) return;
  const files = await walk(outputDir);
  const textFiles = files.filter((file) => textExtensions.has(path.extname(file).toLowerCase()));

  for (const file of textFiles) {
    let text = await fs.readFile(file, "utf-8");
    let changed = false;

    for (const [from, to] of replacements) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
    }

    if (changed) {
      await fs.writeFile(file, text, "utf-8");
    }
  }
}

async function optimizeImages() {
  if (!(await exists(uploadDir))) return;

  const files = await walk(uploadDir);
  const imageFiles = files.filter((file) => imageExtensions.has(path.extname(file).toLowerCase()));
  const replacements = [];
  let savedBytes = 0;

  for (const file of imageFiles) {
    const sourceStat = await fs.stat(file);
    const ext = path.extname(file);
    const target = file.slice(0, -ext.length) + ".webp";

    const image = sharp(file, { animated: false });
    const metadata = await image.metadata();
    const shouldResize = metadata.width && metadata.width > maxWidth;

    await image
      .rotate()
      .resize(shouldResize ? { width: maxWidth, withoutEnlargement: true } : undefined)
      .webp({ quality: webpQuality, effort: 5 })
      .toFile(target);

    const targetStat = await fs.stat(target);
    const savedRatio = 1 - targetStat.size / sourceStat.size;

    if (targetStat.size < sourceStat.size && savedRatio >= minSavingsRatio) {
      await fs.rm(file);
      replacements.push([publicPath(file), publicPath(target)]);
      savedBytes += sourceStat.size - targetStat.size;
      console.log(`optimized ${path.basename(file)} -> ${path.basename(target)} (${Math.round(savedRatio * 100)}% smaller)`);
    } else {
      await fs.rm(target);
    }
  }

  await replaceReferences(replacements);

  if (savedBytes > 0) {
    console.log(`Saved ${(savedBytes / 1024 / 1024).toFixed(1)}MB from upload images.`);
  } else {
    console.log("No image optimization savings found.");
  }
}

optimizeImages().catch((error) => {
  console.error(error);
  process.exit(1);
});
