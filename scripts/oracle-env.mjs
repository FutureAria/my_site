import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const root = process.cwd();
const envPath = path.join(root, ".env.oracle");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export const oracleEnv = {
  root,
  host: process.env.ORACLE_HOST || "132.145.186.82",
  user: process.env.ORACLE_USER || "ubuntu",
  keyPath: process.env.ORACLE_KEY_PATH || "/Users/juyoung/workspace/kis-ai-trader/oracle_key",
  remoteDir: process.env.ORACLE_REMOTE_DIR || "/home/ubuntu/my_site",
  port: process.env.ORACLE_APP_PORT || "3000",
  publicHost: process.env.ORACLE_PUBLIC_HOST || "http://132.145.186.82",
  serviceName: process.env.ORACLE_SERVICE_NAME || "my-site",
  adminPassword: process.env.ADMIN_PASSWORD || "",
};

export function requireOracleEnv() {
  const missing = [];
  if (!oracleEnv.host) missing.push("ORACLE_HOST");
  if (!oracleEnv.user) missing.push("ORACLE_USER");
  if (!oracleEnv.keyPath) missing.push("ORACLE_KEY_PATH");
  if (!oracleEnv.adminPassword) missing.push("ADMIN_PASSWORD");

  if (missing.length > 0) {
    console.error(`Missing ${missing.join(", ")}. Create .env.oracle from .env.oracle.example first.`);
    process.exit(1);
  }

  if (!fs.existsSync(oracleEnv.keyPath)) {
    console.error(`Oracle SSH key does not exist: ${oracleEnv.keyPath}`);
    process.exit(1);
  }
}

export function sshBaseArgs() {
  return [
    "-i",
    oracleEnv.keyPath,
    "-o",
    "IdentitiesOnly=yes",
    "-o",
    "BatchMode=yes",
    `${oracleEnv.user}@${oracleEnv.host}`,
  ];
}
