import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import dotenv from "dotenv";

const root = process.cwd();
const envPath = path.join(root, ".env.dothome");
const debounceMs = Number(process.env.DOTHOME_WATCH_DEBOUNCE || 2500);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const requiredEnv = ["DOTHOME_FTP_USER", "DOTHOME_FTP_PASSWORD"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing ${missingEnv.join(", ")}. Create .env.dothome before starting the watcher.`);
  process.exit(1);
}

const watchTargets = [
  "app",
  "components",
  "data",
  "dothome",
  "lib",
  "public",
  "scripts/build-dothome-static.mjs",
  "scripts/deploy-dothome-ftp.mjs",
  "next.config.js",
  "package.json",
  "package-lock.json",
  "postcss.config.js",
  "tailwind.config.js",
  "tsconfig.json",
];

const ignored = [
  "**/.DS_Store",
  "**/.next/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/CoverLetter/**",
  "**/.git/**",
];

let timer = null;
let running = false;
let queued = false;

function runPublish(reason) {
  if (running) {
    queued = true;
    console.log(`Change queued while publishing: ${reason}`);
    return;
  }

  running = true;
  queued = false;
  console.log(`\nPublishing to Dothome: ${reason}`);

  const child = spawn("npm", ["run", "publish:dothome"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code) => {
    running = false;
    if (code === 0) {
      console.log("Auto publish complete.");
    } else {
      console.error(`Auto publish failed with code ${code}.`);
    }

    if (queued) {
      runPublish("queued changes");
    }
  });
}

function schedulePublish(filePath) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    runPublish(filePath);
  }, debounceMs);
}

const watcher = chokidar.watch(watchTargets, {
  cwd: root,
  ignored,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 800,
    pollInterval: 100,
  },
});

watcher.on("all", (eventName, filePath) => {
  console.log(`${eventName}: ${filePath}`);
  schedulePublish(filePath);
});

watcher.on("ready", () => {
  console.log("Dothome auto publish watcher is running.");
  console.log("Watching app, components, data, dothome, lib, public, and config files.");
  console.log("Press Ctrl+C to stop.");
});

watcher.on("error", (error) => {
  console.error(error);
});

