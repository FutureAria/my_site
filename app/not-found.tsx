import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-16 text-[var(--text-primary)] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
          404 Not Found
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
          이 페이지는 지금 포트폴리오에 없습니다.
        </h1>
        <p className="readable-copy mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          주소가 바뀌었거나, 아직 공개하지 않은 페이지일 수 있습니다.
          대표 프로젝트와 연락처는 홈에서 바로 확인할 수 있습니다.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-emerald-600"
          >
            대표 프로젝트 보기
          </Link>
          <Link
            href="/#contact-form"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition-all hover:border-emerald-400/30 hover:bg-white/5 hover:text-white"
          >
            연락처로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
