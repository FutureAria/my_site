import { spawn } from "child_process";
import { oracleEnv, requireOracleEnv, sshBaseArgs } from "./oracle-env.mjs";

requireOracleEnv();

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function serviceEnvLine(key, value) {
  return value ? `Environment=${key}=${value}` : "";
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed with code ${code}`));
    });
  });
}

const remoteScript = `
set -e

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

sudo mkdir -p ${shellQuote(oracleEnv.remoteDir)}
sudo chown -R ${shellQuote(oracleEnv.user)}:${shellQuote(oracleEnv.user)} ${shellQuote(oracleEnv.remoteDir)}
sudo chmod o+x /home/${oracleEnv.user}

sudo tee /etc/systemd/system/${oracleEnv.serviceName}.service >/dev/null <<'SERVICE'
[Unit]
Description=Juyoung portfolio Next.js site
After=network.target

[Service]
Type=simple
User=${oracleEnv.user}
WorkingDirectory=${oracleEnv.remoteDir}
Environment=NODE_ENV=production
Environment=PORT=${oracleEnv.port}
Environment=NEXT_PUBLIC_SITE_URL=${oracleEnv.publicHost}
${serviceEnvLine("ADMIN_PASSWORD", oracleEnv.adminPassword)}
${serviceEnvLine("ADMIN_PASSWORD_HASH", oracleEnv.adminPasswordHash)}
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak_my_site_$(date +%Y%m%d_%H%M%S)
sudo python3 - <<'PY'
from pathlib import Path

path = Path("/etc/caddy/Caddyfile")
text = path.read_text()
marker = "# my_site portfolio"
if marker in text:
    text = text.split(marker)[0].rstrip() + "\\n"
else:
    text = text.rstrip() + "\\n"

block = """
# my_site portfolio
juyoung-portfolio.duckdns.org {
\tencode zstd gzip
\theader /_next/static/* Cache-Control "public, max-age=31536000, immutable"
\thandle /uploads/* {
\t\troot * ${oracleEnv.remoteDir}/public
\t\theader Cache-Control "public, max-age=31536000, immutable"
\t\tfile_server
\t}
\thandle /sw.js {
\t\troot * ${oracleEnv.remoteDir}/public
\t\theader Cache-Control "public, max-age=0, must-revalidate"
\t\tfile_server
\t}
\treverse_proxy 127.0.0.1:${oracleEnv.port}
}

"""
path.write_text(text + "\\n" + block.lstrip())
PY


sudo systemctl daemon-reload
sudo systemctl enable ${oracleEnv.serviceName}
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
node -v
npm -v
`;

await run("ssh", [...sshBaseArgs(), remoteScript]);
