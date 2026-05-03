import PageFrame from "@/components/PageFrame";
import LiveJournalPage from "@/components/LiveJournalPage";
import { getPortfolioData } from "@/lib/portfolio";

export default function JournalPage() {
  const data = getPortfolioData();

  return (
    <PageFrame>
      <section className="px-4 pb-14 pt-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">JOURNAL</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            배운 것과 해결한 문제를 남기는 공간
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 ink-muted">
            프로젝트를 진행하며 마주친 문제, 정리한 개념, 다음 작업에 남기고 싶은 생각을 모았습니다.
          </p>
        </div>
      </section>

      <section className="border-t hairline px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <LiveJournalPage initialData={data} />
        </div>
      </section>
    </PageFrame>
  );
}
