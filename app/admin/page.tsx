import AdminEditor from "@/components/AdminEditor";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import PageFrame from "@/components/PageFrame";
import { getPortfolioData } from "@/lib/portfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  const data = getPortfolioData();
  const imageCount = data.projects.reduce((total, project) => total + (project.image ? 1 : 0) + (project.detail?.images?.length || 0), 0);

  return (
    <PageFrame>
      <section className="px-4 pb-12 pt-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">ADMIN</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            포트폴리오 내용을 직접 수정하는 공간
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 ink-muted">
            메인 문구, 연락처, 프로젝트, Journal 기록을 수정하고 추가할 수 있습니다.
            저장하면 `data/portfolio.json`에 반영됩니다.
          </p>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              ["프로젝트", `${data.projects.length}개`, "목록, 상세 설명, 이미지 기록을 관리합니다."],
              ["Journal", `${data.blog.length}개`, "문제 해결 과정과 학습 기록을 접어 볼 수 있게 관리합니다."],
              ["이미지", `${imageCount}장`, "홈 화면, 대표 이미지, 프로젝트 상세 이미지를 업로드합니다."],
            ].map(([label, value, desc]) => (
              <div key={label} className="border-t hairline pt-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">{label}</p>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
                <p className="mt-2 text-sm leading-6 ink-muted">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 border-y hairline py-5 md:grid-cols-3">
            {[
              ["1. 탭 선택", "홈, 대표, 프로젝트, Journal 중 수정할 영역을 먼저 고릅니다."],
              ["2. 내용 수정", "문구와 이미지 경로를 바꾸거나 여러 이미지를 업로드합니다."],
              ["3. 저장 확인", "저장하기를 누른 뒤 새로고침하면 실제 화면에 반영됩니다."],
            ].map(([title, body]) => (
              <div key={title}>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 ink-muted">{body}</p>
              </div>
            ))}
          </div>
          <AdminLogoutButton />
        </div>
      </section>
      <section className="border-t hairline px-4 pb-24 pt-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AdminEditor initialData={data} />
        </div>
      </section>
    </PageFrame>
  );
}
