import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProjectScreenshotGallery from "@/components/ProjectScreenshotGallery";

export const dynamic = "force-dynamic";

interface ProjectDetail {
  role?: string;
  features?: string[];
  challenges?: string;
  takeaways?: string[];
  images?: string[];
}

interface ProjectDemo {
  ctaLabel?: string;
  note?: string;
}

interface ProjectDocument {
  title?: string;
  description?: string;
  file?: string;
  preview?: string;
  type?: string;
}

interface Project {
  title: string;
  period: string;
  desc: string;
  techs: string[];
  image: string;
  link: string;
  github: string;
  demo?: ProjectDemo;
  documents?: ProjectDocument[];
  detail?: ProjectDetail;
}

const challengeBlocks: Record<string, { label: string; cls: string; dot: string }> = {
  "문제": {
    label: "문제 상황",
    cls: "border-rose-500/25 bg-gradient-to-br from-rose-500/10 to-rose-500/0",
    dot: "bg-rose-400",
  },
  "해결": {
    label: "해결 과정",
    cls: "border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0",
    dot: "bg-emerald-400",
  },
  "배운 점": {
    label: "배운 점",
    cls: "border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-blue-500/0",
    dot: "bg-blue-400",
  },
};

function parseChallenges(text: string) {
  if (!text) return [] as Array<{ key: string; body: string }>;
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block) => {
    const match = block.match(/^(문제|해결|배운 점)\s*:\s*([\s\S]+)$/);
    if (match) return { key: match[1], body: match[2].trim() };
    return { key: "", body: block };
  });
}

async function getData() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "portfolio.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idx = parseInt(id, 10);
  const data = await getData();
  const project: Project | undefined = data.projects[idx];

  if (!project) notFound();

  const detail: ProjectDetail = project.detail || {};
  const role = detail.role || "";
  const features = detail.features || [];
  const challengeSections = parseChallenges(detail.challenges || "");
  const takeaways = detail.takeaways || [];
  const screenshots = detail.images || [];
  const demo = project.demo;
  const documents = project.documents || [];
  const hasDemoGuide = Boolean(demo?.note);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/#projects"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            프로젝트 목록
          </Link>
          <Link href="/" className="hidden sm:inline-block font-bold text-base gradient-text tracking-tight">
            JY.
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {project.image && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-[var(--border-color)] relative h-56 sm:h-96 group">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-300 mb-2">
                Project · {String(idx + 1).padStart(2, "0")}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black leading-tight">
                {project.title}
              </h1>
              <p className="text-sm text-gray-300 mt-2">{project.period}</p>
            </div>
          </div>
        )}

        {!project.image && (
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">
              Project · {String(idx + 1).padStart(2, "0")}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-3">
              {project.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">{project.period}</p>
          </div>
        )}

        <p className="readable-copy text-[var(--text-secondary)] text-base sm:text-lg leading-8 sm:leading-9 text-left mb-10">
          {project.desc}
        </p>

        {(project.link || project.github) && (
          <div className="mb-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {demo?.ctaLabel || "라이브 데모"}
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-semibold hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  소스 코드
                </a>
              )}
            </div>
            {hasDemoGuide && (
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300">
                      읽기 전용 데모 안내
                    </p>
                    {demo?.note && (
                      <p className="readable-copy mt-2 text-sm leading-7 text-[var(--text-secondary)] text-left">
                        {demo.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {project.techs.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {role && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-4">담당 역할</h2>
            <div className="glass rounded-2xl p-6 border-l-4 border-emerald-500/40">
              <p className="readable-copy text-[var(--text-secondary)] leading-8 text-left">
                {role}
              </p>
            </div>
          </section>
        )}

        {features.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-4">주요 기능</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 shrink-0" />
                  <span className="readable-copy text-sm text-[var(--text-secondary)] leading-7">{f}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {challengeSections.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-amber-400 mb-4">
              문제 해결 과정
            </h2>
            <div className="space-y-4">
              {challengeSections.map((block, i) => {
                const meta = challengeBlocks[block.key];
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border p-6 ${meta ? meta.cls : "border-[var(--border-color)] bg-[var(--bg-hover)]"}`}
                  >
                    {meta && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--text-primary)]">
                          {meta.label}
                        </span>
                      </div>
                    )}
                    <p className="readable-copy text-[var(--text-secondary)] leading-8 text-left">
                      {block.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {takeaways.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-purple-400 mb-4">
              프로젝트에서 배운 것
            </h2>
            <div className="space-y-3">
              {takeaways.map((item, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="readable-copy text-sm text-[var(--text-secondary)] leading-7 text-left">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {documents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-4">
              기획자료
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc, docIndex) => (
                <div
                  key={`${doc.file || doc.preview || docIndex}`}
                  className="glass rounded-2xl p-5 border border-[var(--border-color)]"
                >
                  <p className="text-base font-bold text-[var(--text-primary)]">
                    {doc.title || "프로젝트 문서"}
                  </p>
                  {doc.description && (
                    <p className="readable-copy mt-2 text-sm leading-7 text-[var(--text-secondary)] text-left">
                      {doc.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/projects/${idx}/documents/${docIndex}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/15"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      사이트에서 보기
                    </Link>
                    {doc.file && (
                      <a
                        href={doc.file}
                        download
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 16.5V3" />
                        </svg>
                        다운로드
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <ProjectScreenshotGallery
          projectTitle={project.title}
          screenshots={screenshots}
        />

        {!role && features.length === 0 && challengeSections.length === 0 && takeaways.length === 0 && screenshots.length === 0 && documents.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-[var(--text-secondary)] text-sm">
              상세 내용은 관리자 페이지에서 추가할 수 있습니다.
            </p>
            <a
              href="/admin"
              className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              관리자 페이지로 이동 →
            </a>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/#projects"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            다른 프로젝트 보기
          </Link>
          <Link
            href="/#contact"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg shadow-blue-500/20"
          >
            연락하기
          </Link>
        </div>
      </main>
    </div>
  );
}
