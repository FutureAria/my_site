import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProjectScreenshotGallery from "@/components/ProjectScreenshotGallery";

export const revalidate = 60;

interface ProjectDetail {
  role?: string;
  contribution?: {
    overall?: string[];
    owned?: string[];
  };
  interviewQuestions?: Array<{
    q?: string;
    a?: string;
  }>;
  impact?: string;
  problem?: string;
  solution?: string;
  result?: string;
  architecture?: string;
  erd?: string;
  apiSpec?: string;
  troubleshooting?: string;
  readme?: string;
  mobileCheck?: string;
  compatibilityCheck?: string;
  performance?: string;
  security?: string;
  operations?: string;
  features?: string[];
  challenges?: string;
  takeaways?: string[];
  images?: string[];
  imageCaptions?: string[];
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
  category?: string;
  problem?: string;
  teaser?: string;
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

const PROJECT_DETAIL_COPY: Record<
  string,
  {
    headline: string;
    summary: string;
    problem: string;
    role: string;
    result: string;
  }
> = {
  "장바구니 기능 기반 수강신청 웹 플랫폼": {
    headline: "동시 신청에도 정원 초과 방지",
    summary: "장바구니에서 신청 확정까지 이어지는 흐름을 트랜잭션과 행 잠금 기준으로 정리했습니다.",
    problem: "동시에 신청하면 정원 초과가 생길 수 있었습니다.",
    role: "신청 DB와 트랜잭션 처리 흐름을 맡았습니다.",
    result: "정원, 장바구니, 신청 내역의 정합성을 설명할 수 있게 정리했습니다.",
  },
  "CRUD 기반 물품 관리 웹 시스템": {
    headline: "저장 결과 즉시 반영",
    summary: "등록, 수정, 삭제 이후 API 응답을 기준으로 목록 상태가 다시 맞춰지도록 구성했습니다.",
    problem: "저장 후 화면 상태가 늦게 바뀌거나 어긋났습니다.",
    role: "목록 상태, 입력 폼, API 갱신 흐름을 분리했습니다.",
    result: "사용자가 저장 결과를 바로 확인할 수 있게 했습니다.",
  },
  "데이터 기반 AI 상권 분석 및 추천 서비스": {
    headline: "공공데이터를 상권 점수로 전환",
    summary: "공공 API 데이터를 수집·정제하고 추천 기준으로 연결해 상권 판단 화면을 만들었습니다.",
    problem: "흩어진 공공데이터만으로는 상권 판단 기준이 보이지 않았습니다.",
    role: "API 수집, 결측치 정리, 점수화 흐름을 맡았습니다.",
    result: "상권 추천 결과를 화면에서 비교할 수 있게 했습니다.",
  },
  "KIS AI 트레이더": {
    headline: "근거 공개 / 주문 잠금",
    summary: "시장 데이터와 모의투자 기록을 보여주고, 실제 주문은 잠근 개인 프로젝트입니다.",
    problem: "AI 판단과 주문 권한이 섞이면 방문자가 실거래로 오해할 수 있었습니다.",
    role: "수집, 판단 근거, 읽기 전용 화면을 직접 설계했습니다.",
    result: "공개 화면은 읽기 전용, 실제 주문은 승인 전 잠금으로 분리했습니다.",
  },
  "BASE CHAIN - 블록체인 야구 티켓팅 플랫폼": {
    headline: "예매부터 QR 입장까지",
    summary: "분리된 코드를 합치고 MOCK 결제, QR 입장, 포인트 흐름을 운영 화면으로 연결했습니다.",
    problem: "기능은 있었지만 버전이 나뉘어 최신 시연 흐름이 끊겼습니다.",
    role: "코드 통합, 프론트/백엔드 수정, 시연 오류를 정리했습니다.",
    result: "Oracle 배포본에서 최신 화면과 MOCK 결제 흐름을 확인할 수 있게 했습니다.",
  },
  "AI 감정 분석 기반 음악 추천 서비스 (개발 중)": {
    headline: "감정 기록 기반 추천 설계",
    summary: "Gemini 응답과 사용자 감정 히스토리를 추천 데이터로 연결하는 구조를 설계하고 있습니다.",
    problem: "감정 분석 결과를 추천 기준으로 바로 쓰기 어려웠습니다.",
    role: "감정 분석 응답과 추천 기준 연결 구조를 정리했습니다.",
    result: "사용자 히스토리 기반 추천 흐름을 검증 중입니다.",
  },
  Major_Link: {
    headline: "MVP 범위 먼저 검증",
    summary: "기능, 일정, 역할, 비용을 개발 전 검증 문서로 정리했습니다.",
    problem: "아이디어만 있으면 개발 범위와 검증 기준이 흐려졌습니다.",
    role: "MVP 범위, 일정표, 역할 분담표, 비용 계획을 정리했습니다.",
    result: "무엇을 만들고 무엇을 제외할지 먼저 나눴습니다.",
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

const sectionToneClasses = {
  emerald: "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-300",
  blue: "border-blue-500/20 bg-blue-500/[0.04] text-blue-300",
  cyan: "border-cyan-500/20 bg-cyan-500/[0.04] text-cyan-300",
  amber: "border-amber-500/20 bg-amber-500/[0.05] text-amber-300",
  purple: "border-purple-500/20 bg-purple-500/[0.04] text-purple-300",
  rose: "border-rose-500/20 bg-rose-500/[0.04] text-rose-300",
};

function DetailSection({
  title,
  eyebrow,
  children,
  defaultOpen = false,
  tone = "blue",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  tone?: keyof typeof sectionToneClasses;
}) {
  const toneClass = sectionToneClasses[tone];

  return (
    <details
      open={defaultOpen}
      className={`detail-accordion group mb-4 rounded-2xl border ${toneClass} transition-colors open:bg-white/[0.035]`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-90">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-base font-bold text-[var(--text-primary)]">
            {title}
          </h2>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--text-secondary)] transition-transform group-open:rotate-180">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="detail-accordion-body border-t border-white/10 px-5 pb-5 pt-4 sm:px-6">
        {children}
      </div>
    </details>
  );
}

function TextLines({
  text,
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  if (!text) return null;

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className={`readable-copy text-left ${className}`}>
        {text}
      </p>
    );
  }

  return (
    <ul className={`space-y-2 text-left ${className}`}>
      {lines.map((line) => (
        <li key={line} className="readable-copy flex gap-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

async function getData() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "portfolio.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export async function generateStaticParams() {
  const data = await getData();
  return (data.projects || []).map((_: Project, id: number) => ({
    id: String(id),
  }));
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
  const outcomeItems = [
    { label: "문제", body: detail.problem },
    { label: "해결", body: detail.solution },
    { label: "결과", body: detail.result },
  ].filter((item) => item.body);
  const documentItems = [
    { label: "아키텍처", body: detail.architecture },
    { label: "ERD / DB", body: detail.erd },
    { label: "API 명세", body: detail.apiSpec },
  ].filter((item) => item.body);
  const validationItems = [
    { label: "모바일 확인", body: detail.mobileCheck },
    { label: "브라우저 호환", body: detail.compatibilityCheck },
    { label: "성능 측정", body: detail.performance },
    { label: "보안 체크", body: detail.security },
    { label: "운영 경험", body: detail.operations },
  ].filter((item) => item.body);
  const features = detail.features || [];
  const challengeSections = parseChallenges(detail.challenges || "");
  const takeaways = detail.takeaways || [];
  const interviewQuestions = detail.interviewQuestions || [];
  const screenshots = detail.images || [];
  const demo = project.demo;
  const documents = project.documents || [];
  const hasDemoGuide = Boolean(demo?.note);
  const compactCopy = PROJECT_DETAIL_COPY[project.title];
  const projectHook = compactCopy?.headline || project.problem || detail.problem || project.desc;
  const projectTeaser = compactCopy?.summary || project.teaser || detail.impact || project.desc;
  const snapshotItems = [
    { label: "문제", body: compactCopy?.problem || detail.problem || projectHook },
    { label: "내 역할", body: compactCopy?.role || role },
    { label: "확인 결과", body: compactCopy?.result || detail.impact || detail.result },
  ].filter((item) => item.body);

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
              <h1 className="korean-title-wrap max-w-[20rem] text-[1.4rem] font-black leading-tight sm:max-w-full sm:text-4xl">
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
            <h1 className="korean-title-wrap mb-3 text-3xl font-black leading-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">{project.period}</p>
          </div>
        )}

        <section className="project-detail-hero mb-10 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-emerald-500/10 p-5 shadow-2xl shadow-black/10 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              {project.category && (
                <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {project.category}
                </span>
              )}
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                먼저 볼 핵심
              </p>
              <h2 className="mt-2 max-w-2xl text-xl font-black leading-tight text-white sm:text-3xl">
                {projectHook}
              </h2>
              <p className="readable-copy mt-4 text-sm leading-7 text-[var(--text-secondary)] text-left sm:text-base">
                {projectTeaser}
              </p>
              {!compactCopy && (
                <p className="readable-copy mt-3 line-clamp-2 text-sm leading-7 text-gray-400 text-left">
                  {project.desc}
                </p>
              )}

              {(project.link || project.github || documents.length > 0 || screenshots.length > 0 || detail.readme) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:from-blue-600 hover:to-emerald-600 sm:w-auto"
                    >
                      {demo?.ctaLabel || "운영 화면 보기"}
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-200 transition-all hover:-translate-y-0.5 hover:bg-white/5 hover:text-white sm:w-auto"
                    >
                      GitHub
                    </a>
                  )}
                  {documents.length > 0 && (
                    <Link
                      href={`/projects/${idx}/documents/0`}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/15 sm:w-auto"
                    >
                      설계 문서 보기
                    </Link>
                  )}
                  {screenshots.length > 0 && (
                    <a
                      href="#screenshots"
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition-all hover:-translate-y-0.5 hover:bg-cyan-500/15 sm:w-auto"
                    >
                      화면 보기
                    </a>
                  )}
                  {detail.readme && (
                    <a
                      href={detail.readme}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 transition-all hover:-translate-y-0.5 hover:bg-white/5 hover:text-white sm:w-auto"
                    >
                      README
                    </a>
                  )}
                </div>
              )}
            </div>

            {snapshotItems.length > 0 && (
              <div className="grid gap-3">
                {snapshotItems.map((item) => (
                  <div
                    key={item.label}
                    className="detail-proof-card rounded-2xl border border-white/10 bg-gray-950/35 p-4"
                  >
                    <p className="text-xs font-semibold tracking-widest text-emerald-300">
                      {item.label}
                    </p>
                    <TextLines
                      text={item.body}
                      className="mt-2 line-clamp-2 text-sm leading-7 text-gray-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasDemoGuide && demo?.note && (
            <div className="detail-demo-note mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300">
                읽기 전용 데모 안내
              </p>
              <p className="readable-copy mt-2 text-sm leading-7 text-[var(--text-secondary)] text-left">
                {demo.note}
              </p>
            </div>
          )}
        </section>

        {(detail.contribution?.overall?.length || detail.contribution?.owned?.length) && (
          <DetailSection title="전체 기능 / 제 기여" eyebrow="contribution" tone="emerald" defaultOpen>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detail.contribution?.overall?.length ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold tracking-widest uppercase text-cyan-300">
                    전체 프로젝트 기능
                  </p>
                  <ul className="mt-3 space-y-2 text-left text-sm leading-7 text-[var(--text-secondary)]">
                    {detail.contribution.overall.map((item) => (
                      <li key={item} className="readable-copy flex gap-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {detail.contribution?.owned?.length ? (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
                  <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300">
                    제가 맡아 정리한 부분
                  </p>
                  <ul className="mt-3 space-y-2 text-left text-sm leading-7 text-[var(--text-secondary)]">
                    {detail.contribution.owned.map((item) => (
                      <li key={item} className="readable-copy flex gap-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </DetailSection>
        )}

        {role && (
          <DetailSection title="내 역할 · 규모" eyebrow="role" tone="emerald">
            <TextLines
              text={role}
              className="text-[var(--text-secondary)] leading-8"
            />
          </DetailSection>
        )}

        <section className="mb-12 mt-8">
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

        {(detail.impact || outcomeItems.length > 0) && (
          <DetailSection title="문제 · 해결 · 결과" eyebrow="case flow" tone="blue">
            {detail.impact && (
              <div className="mb-4 rounded-2xl border border-blue-500/25 bg-blue-500/10 p-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-blue-300">
                  핵심 성과
                </p>
                <TextLines
                  text={detail.impact}
                  className="mt-2 text-[var(--text-secondary)] leading-8"
                />
              </div>
            )}
            {outcomeItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {outcomeItems.map((item) => (
                  <div
                    key={item.label}
                    className="glass rounded-xl border border-[var(--border-color)] p-5"
                  >
                    <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300">
                      {item.label}
                    </p>
                    <TextLines
                      text={item.body}
                      className="mt-2 text-sm leading-7 text-[var(--text-secondary)]"
                    />
                  </div>
                ))}
              </div>
            )}
          </DetailSection>
        )}

        {documentItems.length > 0 && (
          <DetailSection title="설계 / 문서" eyebrow="architecture" tone="cyan">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {documentItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5"
                >
                  <p className="text-xs font-semibold tracking-widest uppercase text-cyan-300">
                    {item.label}
                  </p>
                  <TextLines
                    text={item.body}
                    className="mt-2 text-sm leading-7 text-[var(--text-secondary)]"
                  />
                </div>
              ))}
            </div>
            {detail.readme && (
              <a
                href={detail.readme}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                README / 문서 링크 보기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </DetailSection>
        )}

        {detail.troubleshooting && (
          <DetailSection title="트러블슈팅" eyebrow="debugging" tone="amber">
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-6">
              <TextLines
                text={detail.troubleshooting}
                className="text-[var(--text-secondary)] leading-8"
              />
            </div>
          </DetailSection>
        )}

        {validationItems.length > 0 && (
          <DetailSection title="검증 / 운영 기록" eyebrow="verification" tone="purple">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {validationItems.map((item) => (
                <div
                  key={item.label}
                  className="glass rounded-xl border border-[var(--border-color)] p-5"
                >
                  <p className="text-xs font-semibold tracking-widest uppercase text-purple-300">
                    {item.label}
                  </p>
                  <p className="readable-copy mt-2 text-sm leading-7 text-[var(--text-secondary)] text-left">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {features.length > 0 && (
          <DetailSection title="주요 기능" eyebrow="features" tone="blue">
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
          </DetailSection>
        )}

        {challengeSections.length > 0 && (
          <DetailSection title="문제 해결 과정" eyebrow="problem solving" tone="amber">
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
                    <TextLines
                      text={block.body}
                      className="text-[var(--text-secondary)] leading-8"
                    />
                  </div>
                );
              })}
            </div>
          </DetailSection>
        )}

        {takeaways.length > 0 && (
          <DetailSection title="프로젝트에서 배운 것" eyebrow="takeaways" tone="purple">
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
          </DetailSection>
        )}

        {interviewQuestions.length > 0 && (
          <DetailSection title="면접 질문 3개" eyebrow="interview prep" tone="blue" defaultOpen>
            <div className="grid grid-cols-1 gap-3">
              {interviewQuestions.map((item, i) => (
                <div
                  key={`${item.q || i}`}
                  className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5"
                >
                  <p className="text-xs font-semibold tracking-widest uppercase text-blue-300">
                    Q{String(i + 1).padStart(2, "0")}
                  </p>
                  {item.q && (
                    <h3 className="korean-title-wrap mt-2 text-base font-bold leading-7 text-[var(--text-primary)]">
                      {item.q}
                    </h3>
                  )}
                  {item.a && (
                    <p className="readable-copy mt-3 text-left text-sm leading-7 text-[var(--text-secondary)]">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {documents.length > 0 && (
          <DetailSection title="기획자료 / 첨부 문서" eyebrow="documents" tone="emerald">
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
          </DetailSection>
        )}

        {screenshots.length > 0 && (
          <section id="screenshots" className="mt-10">
            <ProjectScreenshotGallery
              projectTitle={project.title}
              screenshots={screenshots}
              captions={detail.imageCaptions}
            />
          </section>
        )}

        {!role && !detail.impact && outcomeItems.length === 0 && documentItems.length === 0 && !detail.troubleshooting && validationItems.length === 0 && features.length === 0 && challengeSections.length === 0 && takeaways.length === 0 && screenshots.length === 0 && documents.length === 0 && (
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
