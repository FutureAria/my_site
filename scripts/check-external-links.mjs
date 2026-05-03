import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "portfolio.json"), "utf-8"));

const links = [
  ["contact.github", data.contact?.github],
  ["contact.homepage", data.contact?.homepage],
  ...data.projects.flatMap((project, index) => [
    [`projects[${index + 1}].link`, project.link],
    [`projects[${index + 1}].github`, project.github],
  ]),
].filter(([, url]) => typeof url === "string" && url.startsWith("http"));

let failed = false;

async function checkLink(label, url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
    }

    const ok = response.status >= 200 && response.status < 400;
    console.log(`${ok ? "OK" : "FAIL"} ${label} ${response.status} ${url}`);
    failed ||= !ok;
  } catch (error) {
    console.log(`WARN ${label} ${error instanceof Error ? error.message : "unknown error"} ${url}`);
  } finally {
    clearTimeout(timeout);
  }
}

for (const [label, url] of links) {
  await checkLink(label, url);
}

if (failed) {
  process.exit(1);
}
