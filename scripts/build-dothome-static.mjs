import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import dotenv from "dotenv";

const root = process.cwd();
dotenv.config({ path: path.join(root, ".env.dothome") });
const outputDir = path.join(root, "dist", "dothome");
const port = Number(process.env.DOTHOME_BUILD_PORT || 3100);
const baseUrl = `http://127.0.0.1:${port}`;

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function run(command, args, options = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, ...options.env },
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

async function copyDir(from, to) {
  if (!(await pathExists(from))) return;
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(source, target);
    } else if (entry.isFile()) {
      await fs.copyFile(source, target);
    }
  }
}

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 20000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Retry until Next is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("Next server did not start in time.");
}

function outputPathForRoute(route) {
  if (route === "/") return path.join(outputDir, "index.html");
  return path.join(outputDir, route.replace(/^\//, ""), "index.html");
}

async function writeRoute(route) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`${route} returned ${response.status}`);
  }
  const html = await response.text();
  const target = outputPathForRoute(route);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html, "utf-8");
  console.log(`wrote ${route}`);
}

async function writeAsset(route, filename) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "follow" });
  if (!response.ok) return;
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(path.join(outputDir, filename), buffer);
  console.log(`wrote ${filename}`);
}

async function main() {
  const data = JSON.parse(await fs.readFile(path.join(root, "data", "portfolio.json"), "utf-8"));
  const projectRoutes = data.projects.map((_, index) => `/projects/${index}`);
  const routes = ["/", "/about", "/projects", ...projectRoutes, "/journal", "/contact", "/admin/login", "/admin"];

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  await run("npm", ["run", "build"], {
    env: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://juwwkd.dothome.co.kr",
    },
  });

  const server = spawn("npx", ["next", "start", "--port", String(port)], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, PORT: String(port), DOTHOME_STATIC_BUILD: "true" },
  });

  try {
    await waitForServer();
    await copyDir(path.join(root, "public"), outputDir);
    await copyDir(path.join(root, "data"), path.join(outputDir, "data"));
    await copyDir(path.join(root, "dothome"), outputDir);
    if (process.env.DOTHOME_ADMIN_PASSWORD) {
      const config = [
        "<?php",
        "declare(strict_types=1);",
        "",
        `define('ADMIN_PASSWORD', ${JSON.stringify(process.env.DOTHOME_ADMIN_PASSWORD)});`,
        "",
      ].join("\n");
      await fs.writeFile(path.join(outputDir, "api", "_config.php"), config, "utf-8");
    }
    await copyDir(path.join(root, ".next", "static"), path.join(outputDir, "_next", "static"));

    for (const route of routes) {
      await writeRoute(route);
    }

    await writeAsset("/robots.txt", "robots.txt");
    await writeAsset("/sitemap.xml", "sitemap.xml");
    await writeAsset("/opengraph-image", "opengraph-image");
    await writeAsset("/icon", "icon");

    await fs.writeFile(
      path.join(outputDir, ".htaccess"),
      [
        "Options -Indexes",
        "DirectoryIndex index.html",
        "<IfModule mod_headers.c>",
        "  <FilesMatch \"portfolio\\.json$|\\.php$\">",
        "    Header set Cache-Control \"no-store, no-cache, must-revalidate, max-age=0\"",
        "  </FilesMatch>",
        "</IfModule>",
        "AddType image/png .png",
        "AddType image/webp .webp",
        "AddType image/jpeg .jpg .jpeg",
        "",
      ].join("\n"),
      "utf-8",
    );

    await fs.writeFile(
      path.join(outputDir, "DEPLOY_README.txt"),
      [
        "Dothome static build output.",
        "Upload the contents of this folder to /hosting/juwwkd/html.",
        "This static bundle does not include the live Next.js admin API.",
        "",
      ].join("\n"),
      "utf-8",
    );

    console.log(`\nDothome static files are ready: ${outputDir}`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
