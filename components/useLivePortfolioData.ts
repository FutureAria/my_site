"use client";

import { useEffect, useState } from "react";
import { adminApiPath } from "@/lib/admin-api";
import type { PortfolioData } from "@/lib/portfolio";

export default function useLivePortfolioData(initialData: PortfolioData) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let cancelled = false;

    async function loadLatestData() {
      try {
        const response = await fetch(adminApiPath("portfolio"), { cache: "no-store" });
        if (!response.ok) return;
        const latest = (await response.json()) as PortfolioData;
        if (!cancelled) setData(latest);
      } catch {
        // Keep the statically rendered data if the PHP/Next API is unavailable.
      }
    }

    loadLatestData();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
