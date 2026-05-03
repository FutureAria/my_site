import PageFrame from "@/components/PageFrame";
import LiveProjectsPage from "@/components/LiveProjectsPage";
import { getPortfolioData } from "@/lib/portfolio";

export default function ProjectsPage() {
  const data = getPortfolioData();

  return (
    <PageFrame>
      <section className="px-4 pb-16 pt-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">PROJECTS</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            만들고 해결한 과정을 기록한 작업들
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 ink-muted">
            구현한 기능보다 더 오래 남는 것은 문제를 바라본 방식이라고 생각합니다.
            각 프로젝트에는 역할, 해결 과정, 사용 기술을 함께 정리했습니다.
          </p>
        </div>
      </section>
      <LiveProjectsPage initialData={data} />
    </PageFrame>
  );
}
