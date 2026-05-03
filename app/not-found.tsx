import Link from "next/link";
import PageFrame from "@/components/PageFrame";

export default function NotFound() {
  return (
    <PageFrame>
      <section className="flex min-h-[80svh] items-center px-4 pt-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">404</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">아직 남기지 않은 기록입니다.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 ink-muted">
            요청한 페이지가 이동되었거나 아직 만들어지지 않았습니다. 프로젝트 목록에서 다른 기록을 확인할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--text)] px-5 text-sm font-semibold text-[color:var(--bg)]">
              홈으로 돌아가기
            </Link>
            <Link href="/projects" className="inline-flex h-11 items-center justify-center rounded-md border hairline px-5 text-sm font-semibold">
              프로젝트 보기
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
