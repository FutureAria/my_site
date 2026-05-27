import fs from "fs";
import path from "path";

const root = process.cwd();
const dataFile = path.join(root, "data", "portfolio.json");
const uploadsDir = path.join(root, "public", "uploads");
const strict = process.argv.includes("--strict");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function collectStringValues(value, output = new Set()) {
  if (typeof value === "string") {
    const matches = value.match(/\/uploads\/[^"'\s)]+/g) || [];
    matches.forEach((match) => output.add(match));
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStringValues(item, output));
    return output;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStringValues(item, output));
  }
  return output;
}

const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
const referenced = collectStringValues(data);
const files = walk(uploadsDir).map((file) => `/${path.relative(path.join(root, "public"), file)}`);
const missing = [...referenced].filter((url) => !fs.existsSync(path.join(root, "public", url)));
const unreferenced = files.filter((file) => !referenced.has(file));

console.log(`Referenced uploads: ${referenced.size}`);
console.log(`Existing upload files: ${files.length}`);
console.log(`Missing referenced files: ${missing.length}`);
missing.forEach((file) => console.log(`MISSING ${file}`));
console.log(`Unreferenced upload files: ${unreferenced.length}`);
unreferenced.slice(0, 80).forEach((file) => console.log(`UNREFERENCED ${file}`));

if (strict && missing.length > 0) {
  process.exitCode = 1;
}
