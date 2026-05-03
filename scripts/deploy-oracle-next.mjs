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
  "--exclude",
  "*.pdf",
  "-e",
  sshTransport,
];

await run("rsync", [...rsyncBase, "./", remote]);
await run("ssh", [...sshBaseArgs(), `mkdir -p ${oracleEnv.remoteDir}/data ${oracleEnv.remoteDir}/public/uploads`]);
await run("rsync", [...seedBase, "data/portfolio.json", `${oracleEnv.user}@${oracleEnv.host}:${oracleEnv.remoteDir}/data/portfolio.json`]);
await run("rsync", [...seedBase, "public/uploads/", `${oracleEnv.user}@${oracleEnv.host}:${oracleEnv.remoteDir}/public/uploads/`]);

await run("ssh", [
  ...sshBaseArgs(),
  [
    `cd ${oracleEnv.remoteDir}`,
    "npm ci",
    "npm run build",
    `sudo systemctl restart ${oracleEnv.serviceName}`,
    `sudo systemctl --no-pager --lines=20 status ${oracleEnv.serviceName}`,
  ].join(" && "),
]);
