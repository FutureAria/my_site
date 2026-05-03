import { spawn } from "child_process";
import { oracleEnv, requireOracleEnv, sshBaseArgs } from "./oracle-env.mjs";

requireOracleEnv();

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
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
Environment=ADMIN_PASSWORD=${oracleEnv.adminPassword}
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

if ! sudo grep -q '# my_site portfolio' /etc/caddy/Caddyfile; then
  sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak_my_site_$(date +%Y%m%d_%H%M%S)
  sudo tee -a /etc/caddy/Caddyfile >/dev/null <<'CADDY'

# my_site portfolio
${oracleEnv.publicHost} {
	reverse_proxy 127.0.0.1:${oracleEnv.port}
}
CADDY
else
  sudo perl -0pi -e "s#http://132\\.145\\.186\\.82 \\{\\n\\treverse_proxy 127\\.0\\.0\\.1:${oracleEnv.port}\\n\\}#${oracleEnv.publicHost} {\\n\\treverse_proxy 127.0.0.1:${oracleEnv.port}\\n}#g" /etc/caddy/Caddyfile
fi

sudo systemctl daemon-reload
sudo systemctl enable ${oracleEnv.serviceName}
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
node -v
npm -v
`;

await run("ssh", [...sshBaseArgs(), remoteScript]);
