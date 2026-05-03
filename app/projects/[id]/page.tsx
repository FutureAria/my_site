import { notFound } from "next/navigation";
import LiveProjectDetailPage from "@/components/LiveProjectDetailPage";
import PageFrame from "@/components/PageFrame";
import { getPortfolioData, getProject } from "@/lib/portfolio";

export function generateStaticParams() {
  return getPortfolioData().projects.map((_, index) => ({ id: String(index) }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectIndex = Number(id);
  const project = getProject(id);
  if (!project) notFound();
  const data = getPortfolioData();

  return (
    <PageFrame>
      <LiveProjectDetailPage initialData={data} projectIndex={projectIndex} />
    </PageFrame>
  );
}
