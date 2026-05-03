"use client";

import {
  AboutPreview,
  ContactTeaser,
  FeaturedProjects,
  HeroMagazine,
  JournalGalleryPreview,
} from "@/components/HomeSections";
import useLivePortfolioData from "@/components/useLivePortfolioData";
import type { PortfolioData, ProjectItem } from "@/lib/portfolio";

function getFeaturedProjects(data: PortfolioData): Array<ProjectItem & { originalIndex: number }> {
  const indexes = data.settings?.featuredProjectIndexes?.length
    ? data.settings.featuredProjectIndexes
    : [0, 1, 2];

  return indexes
    .map((index) => {
      const project = data.projects[index];
      return project ? { ...project, originalIndex: index } : undefined;
    })
    .filter(Boolean)
    .slice(0, 3) as Array<ProjectItem & { originalIndex: number }>;
}

export default function LiveHomePage({ initialData }: { initialData: PortfolioData }) {
  const data = useLivePortfolioData(initialData);
  const featuredProjects = getFeaturedProjects(data);

  return (
    <>
      <HeroMagazine data={data} />
      <FeaturedProjects projects={featuredProjects} />
      <AboutPreview data={data} />
      <JournalGalleryPreview data={data} />
      <ContactTeaser email={data.contact.email} />
    </>
  );
}
