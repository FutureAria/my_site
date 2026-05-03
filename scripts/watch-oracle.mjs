import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import { oracleEnv, requireOracleEnv } from "./oracle-env.mjs";

requireOracleEnv();

const debounceMs = Number(process.env.ORACLE_WATCH_DEBOUNCE || 3500);

const watchTargets = [
  "app",
  "components",
  "data",
  "lib",
  "public",
  "scripts/deploy-oracle-next.mjs",
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
  "**/public/uploads/*.pdf",
];

let timer = null;
let running = false;
let queued = false;

function runDeploy(reason) {
  if (running) {
    queued = true;
    console.log(`Change queued while deploying: ${reason}`);
    return;
  }

  running = true;
  queued = false;
  console.log(`\nDeploying to Oracle: ${reason}`);

  const child = spawn("npm", ["run", "deploy:oracle"], {
    cwd: oracleEnv.root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code) => {
    running = false;
    if (code === 0) {
      console.log("Oracle auto deploy complete.");
    } else {
      console.error(`Oracle auto deploy failed with code ${code}.`);
    }

    if (queued) {
      runDeploy("queued changes");
    }
  });
}

function scheduleDeploy(filePath) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    runDeploy(filePath);
  }, debounceMs);
}

for (const target of watchTargets) {
  if (!fs.existsSync(path.join(oracleEnv.root, target))) {
    console.warn(`Watch target does not exist: ${target}`);
  }
}

const watcher = chokidar.watch(watchTargets, {
  cwd: oracleEnv.root,
  ignored,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100,
  },
});

watcher.on("all", (eventName, filePath) => {
  console.log(`${eventName}: ${filePath}`);
  scheduleDeploy(filePath);
});

watcher.on("ready", () => {
  console.log("Oracle auto deploy watcher is running.");
  console.log("Code changes will be pushed to Oracle automatically.");
  console.log("Press Ctrl+C to stop.");
});

watcher.on("error", (error) => {
  console.error(error);
});
