import fs from "fs";
import path from "path";
import { Client } from "basic-ftp";
import dotenv from "dotenv";

const root = process.cwd();
const envPath = path.join(root, ".env.dothome");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const localDir = path.resolve(root, process.env.DOTHOME_LOCAL_DIR || "dist/dothome");
const host = process.env.DOTHOME_FTP_HOST || "juwwkd.dothome.co.kr";
const user = process.env.DOTHOME_FTP_USER;
const password = process.env.DOTHOME_FTP_PASSWORD;
const remoteDir = process.env.DOTHOME_REMOTE_DIR || "/html";
const shouldClean = process.env.DOTHOME_FTP_CLEAN === "true";

if (!user || !password) {
  console.error("Missing DOTHOME_FTP_USER or DOTHOME_FTP_PASSWORD. Create .env.dothome first.");
  process.exit(1);
}

if (!fs.existsSync(localDir)) {
  console.error(`Local deploy folder does not exist: ${localDir}`);
  console.error("Run npm run build:dothome first.");
  process.exit(1);
}

const client = new Client();
client.ftp.verbose = process.env.DOTHOME_FTP_VERBOSE === "true";

try {
  await client.access({
    host,
    user,
    password,
    secure: false,
  });

  await client.ensureDir(remoteDir);
  await client.cd(remoteDir);

  if (shouldClean) {
    console.log(`Cleaning remote directory: ${remoteDir}`);
    await client.clearWorkingDir();
  }

  console.log(`Uploading ${localDir} -> ${remoteDir}`);
  await client.uploadFromDir(localDir);
  console.log("Dothome upload complete.");
} finally {
  client.close();
}
