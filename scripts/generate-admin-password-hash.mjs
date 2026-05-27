import crypto from "crypto";
import readline from "readline/promises";

const password = process.argv[2];
const iterations = 210000;

async function readPassword() {
  if (password) return password;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });

  try {
    return await rl.question("Admin password: ");
  } finally {
    rl.close();
  }
}

const input = await readPassword();

if (!input || input.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("base64url");
const hash = crypto.pbkdf2Sync(input, salt, iterations, 32, "sha256").toString("base64url");

console.log(`ADMIN_PASSWORD_HASH=pbkdf2_sha256$${iterations}$${salt}$${hash}`);
