const baseUrl = process.env.CHECK_SITE_URL || "http://localhost:3000";

const checks = [
  { path: "/", status: 200 },
  { path: "/about", status: 200 },
  { path: "/projects", status: 200 },
  { path: "/projects/0", status: 200 },
  { path: "/journal", status: 200 },
  { path: "/contact", status: 200 },
  { path: "/admin/login", status: 200 },
  { path: "/admin", status: 307 },
  { path: "/gallery", status: [200, 307, 308] },
  { path: "/sitemap.xml", status: 200 },
  { path: "/robots.txt", status: 200 },
  { path: "/opengraph-image", status: 200 },
  { path: "/icon", status: 200 },
];

let failed = false;

for (const check of checks) {
  const response = await fetch(`${baseUrl}${check.path}`, { redirect: "manual" });
  const expected = Array.isArray(check.status) ? check.status : [check.status];
  const ok = expected.includes(response.status);
  console.log(`${ok ? "OK" : "FAIL"} ${check.path} ${response.status}`);
  failed ||= !ok;
}

if (failed) {
  process.exit(1);
}
