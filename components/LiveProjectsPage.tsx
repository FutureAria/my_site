"use client";

import ProjectDirectory from "@/components/ProjectDirectory";
import useLivePortfolioData from "@/components/useLivePortfolioData";
import type { PortfolioData } from "@/lib/portfolio";

export default function LiveProjectsPage({ initialData }: { initialData: PortfolioData }) {
  const data = useLivePortfolioData(initialData);

  return <ProjectDirectory projects={data.projects} />;
}
