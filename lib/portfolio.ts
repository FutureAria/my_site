import fs from "fs";
import path from "path";

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  type: string;
  image?: string;
  subjects?: string[];
}

export interface ProjectItem {
  title: string;
  period: string;
  desc: string;
  techs: string[];
  image: string;
  link: string;
  github: string;
  detail?: {
    role?: string;
    features?: string[];
    challenges?: string;
    takeaways?: string[];
    images?: string[];
  };
}

export interface JournalItem {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

export interface PortfolioData {
  settings?: {
    featuredProjectIndexes?: number[];
    home?: {
      eyebrow?: string;
      headline?: string;
      description?: string;
      primaryCtaLabel?: string;
      secondaryCtaLabel?: string;
      noteLabel?: string;
      noteText?: string;
      collageImages?: string[];
    };
  };
  hero: {
    badge: string;
    name: string;
    subtitle: string;
    resumeFile?: string;
    coverLetterFile?: string;
  };
  about: {
    intro: string;
    timeline: TimelineItem[];
  };
  projects: ProjectItem[];
  skills: Record<string, string[]>;
  contact: {
    email: string;
    phone: string;
    address: string;
    homepage: string;
    github: string;
    desc: string;
  };
  blog: JournalItem[];
}

export function getPortfolioData(): PortfolioData {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PortfolioData;
}

export function getProject(id: string): ProjectItem | undefined {
  const index = Number(id);
  if (Number.isNaN(index)) return undefined;
  return getPortfolioData().projects[index];
}

export function getGalleryImages(data: PortfolioData): string[] {
  const projectImages = data.projects.flatMap((project) => [
    project.image,
    ...(project.detail?.images || []),
  ]);
  const timelineImages = data.about.timeline.map((item) => item.image || "");
  return Array.from(new Set([...projectImages, ...timelineImages].filter(Boolean)));
}

export function getFeaturedProjects(data: PortfolioData): Array<ProjectItem & { originalIndex: number }> {
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
