export function adminApiPath(name: "admin-login" | "admin-logout" | "portfolio" | "upload") {
  if (typeof window === "undefined") {
    return `/api/${name}`;
  }

  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
  const isDothome = host.endsWith("dothome.co.kr") || host.includes(".dothome.");

  return isLocal || !isDothome ? `/api/${name}` : `/api/${name}.php`;
}
