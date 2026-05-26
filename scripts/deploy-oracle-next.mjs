import { spawn } from "child_process";
import { oracleEnv, requireOracleEnv, sshBaseArgs } from "./oracle-env.mjs";

requireOracleEnv();

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: oracleEnv.root,
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed with code ${code}`));
    });
  });
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

const remote = `${oracleEnv.user}@${oracleEnv.host}:${oracleEnv.remoteDir}/`;
const sshTransport = `ssh -i ${oracleEnv.keyPath} -o IdentitiesOnly=yes -o BatchMode=yes`;
const rsyncBase = [
  "-az",
  "--delete",
  "--exclude",
  ".git/",
  "--exclude",
  ".next/",
  "--exclude",
  "dist/",
  "--exclude",
  "node_modules/",
  "--exclude",
  "CoverLetter/",
  "--exclude",
  "app/control-room/",
  "--exclude",
  ".env*",
  "--exclude",
  "data/portfolio.json",
  "--exclude",
  "public/uploads/",
  "-e",
  sshTransport,
];

const seedBase = [
  "-az",
  "--ignore-existing",
  "-e",
  sshTransport,
];

const projectDocsSync = [
  "-az",
  "--delete",
  "-e",
  sshTransport,
];

await run("rsync", [...rsyncBase, "./", remote]);
await run("ssh", [...sshBaseArgs(), `mkdir -p ${oracleEnv.remoteDir}/data ${oracleEnv.remoteDir}/public/uploads/project-docs`]);
await run("rsync", [...seedBase, "data/portfolio.json", `${oracleEnv.user}@${oracleEnv.host}:${oracleEnv.remoteDir}/data/portfolio.json`]);
await run("rsync", [...seedBase, "public/uploads/", `${oracleEnv.user}@${oracleEnv.host}:${oracleEnv.remoteDir}/public/uploads/`]);
await run("rsync", [...projectDocsSync, "public/uploads/project-docs/", `${oracleEnv.user}@${oracleEnv.host}:${oracleEnv.remoteDir}/public/uploads/project-docs/`]);

const normalizeUploadPathsScript = `
const fs = require("fs");
const path = require("path");
const file = path.join(process.cwd(), "data", "portfolio.json");
if (fs.existsSync(file)) {
  const uploads = path.join(process.cwd(), "public", "uploads");
  const data = fs.readFileSync(file, "utf8");
  const next = data.replace(/\\/uploads\\/([^"'\\s]+?)\\.(png|jpe?g)/gi, (match, name) => {
    const webp = path.join(uploads, name + ".webp");
    return fs.existsSync(webp) ? "/uploads/" + name + ".webp" : match;
  });
  if (next !== data) fs.writeFileSync(file, next);
}
`;

await run("ssh", [
  ...sshBaseArgs(),
  [
    `cd ${oracleEnv.remoteDir}`,
    "rm -rf app/control-room .next",
    `node -e ${shellQuote(normalizeUploadPathsScript)}`,
    "npm ci",
    "npm run build",
    `sudo systemctl restart ${oracleEnv.serviceName}`,
    `sudo systemctl --no-pager --lines=20 status ${oracleEnv.serviceName}`,
  ].join(" && "),
]);
