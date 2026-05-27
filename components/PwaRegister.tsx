"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update().catch(() => {});
    }).catch(() => {
      // PWA support is progressive; the site should still work normally.
    });
  }, []);

  return null;
}
