"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import GitHubStats from "./GitHubStats";

interface ProjectItem {
  title: string;
  period: string;
  desc: string;
  problem?: string;
  teaser?: string;
  techs: string[];
  image: string;
  link: string;
  github: string;
  category?: string;
  documents?: Array<{
    title?: string;
    file?: string;
    preview?: string;
  }>;
  detail?: {
    role?: string;
    impact?: string;
  };
}

const icons = [
  <svg key="ai" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>,
  <svg key="edu" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>,
  <svg key="crud" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>,
];

const colors = [
  { gradient: "from-blue-500/20 to-cyan-500/20", accent: "text-blue-400" },
  { gradient: "from-emerald-500/20 to-teal-500/20", accent: "text-emerald-400" },
  { gradient: "from-purple-500/20 to-blue-500/20", accent: "text-purple-400" },
];

const CARD_TECH_LIMIT = 3;
const DEFAULT_FILTER_LIMIT = 14;
const IMPORTANT_TECHS = [
  "Oracle Cloud",
  "Caddy",
  "PHP",
  "MySQL",
  "JavaScript",
  "HTML/CSS",
  "React",
  "REST API",
  "Python",
  "API",
  "데이터 분석",
  "AI/ML",
  "TypeScript",
  "Vite",
  "Node.js",
  "MariaDB(MySQL)",
];

const PROJECT_GROUPS = [
  {
    id: "대표 프로젝트",
    title: "대표 프로젝트",
    desc: "가장 보여주고 싶은 문제 해결 기록입니다.",
  },
  {
    id: "백엔드 기초 프로젝트",
    title: "백엔드 기초 프로젝트",
    desc: "정원, 상태, DB 흐름을 다룬 기본기 기록입니다.",
  },
  {
    id: "개발 중 · 기획 프로젝트",
    title: "개발 중 · 기획 프로젝트",
    desc: "검증 중인 아이디어와 기획 기록입니다.",
  },
  {
    id: "기타 프로젝트",
    title: "기타 프로젝트",
    desc: "추가로 정리한 실험과 기록입니다.",
  },
];

const FEATURED_PROJECT_ORDER = [
  "BASE CHAIN - 블록체인 야구 티켓팅 플랫폼",
  "KIS AI 트레이더",
  "MajorLink",
];

const INTERVIEW_ROUTE = [
  {
    href: "/projects/4",
    title: "BASE CHAIN",
    label: "1순위",
    body: "최신 운영 배포본, 코드 통합, MOCK 결제, QR 입장 흐름",
  },
  {
    href: "/projects/3",
    title: "KIS AI 트레이더",
    label: "2순위",
    body: "AI 판단 근거, 읽기 전용 화면, 주문 안전장치 분리",
  },
  {
    href: "/projects/6",
    title: "MajorLink",
    label: "3순위",
    body: "프로필, 모집글, 지원/승인 중심 MVP 범위 정리",
  },
];

const PROJECT_CARD_COPY: Record<
  string,
  {
    hook: string;
    teaser: string;
    role?: string;
    impact?: string;
  }
> = {
  "장바구니 기능 기반 수강신청 웹 플랫폼": {
    hook: "정원 초과 방지",
    teaser: "트랜잭션과 행 잠금으로 신청 흐름을 정리했습니다.",
    role: "신청 DB와 트랜잭션 처리 담당",
    impact: "정원 초과 없이 신청 흐름 정리",
  },
  "CRUD 기반 물품 관리 웹 시스템": {
    hook: "저장 후 화면 동기화",
    teaser: "API 응답 기준으로 목록 상태를 다시 맞췄습니다.",
    role: "목록 상태와 API 갱신 흐름 담당",
    impact: "저장 결과가 즉시 보이도록 개선",
  },
  "데이터 기반 AI 상권 분석 및 추천 서비스": {
    hook: "공공데이터 추천 점수화",
    teaser: "공공 API를 정제해 상권 점수로 연결했습니다.",
    role: "API 수집, 정제, 점수화 흐름 담당",
    impact: "상권 추천 판단 기준을 화면에 연결",
  },
  "KIS AI 트레이더": {
    hook: "개인 프로젝트 · 주문 잠금",
    teaser: "AI 판단 근거는 공개하고 실제 주문 권한은 분리했습니다.",
    role: "수집·판단·읽기 전용 설계",
    impact: "공개 화면 read-only, 주문 잠금",
  },
  "BASE CHAIN - 블록체인 야구 티켓팅 플랫폼": {
    hook: "최신 시연본 통합",
    teaser: "예매, MOCK 결제, QR 입장을 운영 화면으로 연결했습니다.",
    role: "통합·API·UI 오류 정리",
    impact: "최신 Oracle 시연본 반영",
  },
  "AI 감정 분석 기반 음악 추천 서비스 (개발 중)": {
    hook: "감정 기반 추천 설계",
    teaser: "감정 분석 결과를 추천 기준으로 분리했습니다.",
    role: "감정 분석 결과를 추천 기준으로 설계",
    impact: "사용자 히스토리 연동 구조 정리 중",
  },
  MajorLink: {
    hook: "진행 중 · MVP 범위 검증",
    teaser: "프로필, 모집글, 지원/승인을 1차 범위로 좁혔습니다.",
    role: "포함·제외 범위 정리",
    impact: "다음 구현 단위까지 문서화",
  },
};

function getProjectStatusLabel(project: ProjectItem) {
  const text = `${project.title} ${project.period} ${project.category || ""} ${project.problem || ""}`;
  if (/MVP|기획 검증|정리 중/.test(text)) return "기획 검증 중";
  if (/개발 중|설계 중/.test(text)) return "개발 중";
  if (/진행\s*중|진행중/.test(text)) return "진행 중";
  return "해결";
}

export default function Projects({ data }: { data: ProjectItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [showAllTechs, setShowAllTechs] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // 전체 tech 목록 (중복 제거)
  const allTechs = Array.from(new Set(data.flatMap((p) => p.techs)));
  const orderedTechs = [...allTechs].sort((a, b) => {
    const aIndex = IMPORTANT_TECHS.indexOf(a);
    const bIndex = IMPORTANT_TECHS.indexOf(b);
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    return a.localeCompare(b);
  });
  const collapsedTechs = orderedTechs.slice(0, DEFAULT_FILTER_LIMIT);
  const visibleTechs =
    showAllTechs || orderedTechs.length <= DEFAULT_FILTER_LIMIT
      ? orderedTechs
      : activeTech && !collapsedTechs.includes(activeTech)
        ? [...collapsedTechs, activeTech]
        : collapsedTechs;
  const hiddenTechCount = Math.max(orderedTechs.length - collapsedTechs.length, 0);

  const filtered = data.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.techs.some((t) => t.toLowerCase().includes(q));
    const matchTech = !activeTech || p.techs.includes(activeTech);
    return matchSearch && matchTech;
  });
  const groupedProjects = PROJECT_GROUPS.map((group) => {
    const projects = filtered
      .filter((project) => (project.category || "기타 프로젝트") === group.id)
      .sort((a, b) => {
        if (group.id !== "대표 프로젝트") return data.indexOf(a) - data.indexOf(b);
        const aRank = FEATURED_PROJECT_ORDER.indexOf(a.title);
        const bRank = FEATURED_PROJECT_ORDER.indexOf(b.title);
        return (aRank === -1 ? 999 : aRank) - (bRank === -1 ? 999 : bRank);
      });

    return { ...group, projects };
  }).filter((group) => group.projects.length > 0);

  const renderProjectCard = (
    project: ProjectItem,
    i: number,
    sectionOffset: number
  ) => {
    const originalIndex = data.indexOf(project);
    const color = colors[originalIndex % colors.length];
    const categoryLabel = project.category || "기타 프로젝트";
    const compactCopy = PROJECT_CARD_COPY[project.title];
    const hook = project.problem || compactCopy?.hook || project.desc;
    const teaser = project.teaser || compactCopy?.teaser || project.detail?.impact || project.desc;
    const role = project.detail?.role || compactCopy?.role;
    const impact = project.detail?.impact || compactCopy?.impact;
    const visibleCardTechs = project.techs.slice(0, CARD_TECH_LIMIT);
    const cardBadge = getProjectStatusLabel(project);
    const projectHref = `/projects/${originalIndex}`;
    const prefetchProject = () => router.prefetch(projectHref);

    return (
      <div
        key={originalIndex}
        onClick={() => router.push(projectHref)}
        onMouseEnter={prefetchProject}
        onFocus={prefetchProject}
        onTouchStart={prefetchProject}
        className={`group relative glass rounded-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${150 + (sectionOffset + i) * 100}ms` }}
      >
        {/* Card header - image or gradient */}
        {project.image ? (
          <div className="h-44 sm:h-48 relative overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/65 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="project-card-state inline-flex items-center rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                {cardBadge}
              </span>
              <p className="on-media-text readable-copy mt-2 line-clamp-1 text-sm font-bold leading-6 text-white sm:text-base">
                {hook}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`h-44 sm:h-48 bg-gradient-to-br ${color.gradient} flex items-center justify-center relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <div
              className={`${color.accent} relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                {icons[originalIndex % icons.length]}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/65 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="project-card-state inline-flex items-center rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                {cardBadge}
              </span>
              <p className="on-media-text readable-copy mt-2 line-clamp-1 text-sm font-bold leading-6 text-white sm:text-base">
                {hook}
              </p>
            </div>
          </div>
        )}

        {/* Card body */}
        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="project-card-category line-clamp-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-gray-300">
              {categoryLabel}
            </span>
            <span className="shrink-0 text-xs text-gray-500 font-medium">
              {project.period}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">
            {project.title}
          </h3>
          <p className="readable-copy mt-3 line-clamp-1 text-gray-400 text-sm leading-6 text-left">
            {teaser}
          </p>

          <div className="my-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {role && (
              <div className="project-card-note project-card-note-role rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                  내가 맡은 것
                </p>
                <p className="readable-copy mt-1 line-clamp-1 text-xs leading-5 text-gray-300 text-left">
                  {role}
                </p>
              </div>
            )}
            {impact && (
              <div className="project-card-note project-card-note-result rounded-xl border border-blue-500/15 bg-blue-500/5 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-300">
                  결과
                </p>
                <p className="readable-copy mt-1 line-clamp-1 text-xs leading-5 text-gray-300 text-left">
                  {impact}
                </p>
              </div>
            )}
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {visibleCardTechs.map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5 group-hover:border-white/10 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.techs.length > CARD_TECH_LIMIT && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
                +{project.techs.length - CARD_TECH_LIMIT}
              </span>
            )}
          </div>

          {/* GitHub stats */}
          {project.github && <GitHubStats githubUrl={project.github} />}

          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 border-t border-white/5">
            <Link
              href={projectHref}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              문제 해결 보기
            </Link>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                운영 화면 보기
              </a>
            )}
            {project.documents && project.documents.length > 0 && (
              <Link
                href={`${projectHref}/documents/0`}
                className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-7.5A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h6.75M15 18l2.25 2.25L21 16.5" />
                </svg>
                설계 문서 보기
              </Link>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" ref={ref} className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-3 block">
            프로젝트
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            주요 <span className="gradient-text">프로젝트</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto" />
        </div>

        <div
          className={`mb-8 rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.08] via-white/[0.03] to-blue-400/[0.06] p-4 transition-all duration-700 delay-75 sm:p-5 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Interview Route
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">
                면접관 추천 열람 순서
              </h3>
            </div>
            <p className="text-sm leading-6 text-gray-400">
              가장 설명력이 큰 프로젝트부터 배치했습니다.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {INTERVIEW_ROUTE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="interview-route-card group rounded-2xl border border-white/10 bg-gray-950/30 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-white/[0.055]"
              >
                <span className="text-xs font-semibold text-emerald-300">
                  {item.label}
                </span>
                <p className="mt-2 text-base font-bold text-white">
                  {item.title}
                </p>
                <p className="readable-copy mt-2 text-left text-sm leading-6 text-gray-400">
                  {item.body}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-300">
                  상세 보기
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 검색 + 필터 */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* 검색창 */}
          <div className="relative mb-4">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="프로젝트 검색..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* 기술 스택 필터 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTech(null)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!activeTech ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-gray-300"}`}
            >
              전체
            </button>
            {visibleTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeTech === tech ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-gray-300"}`}
              >
                {tech}
              </button>
            ))}
            {hiddenTechCount > 0 && (
              <button
                onClick={() => setShowAllTechs((value) => !value)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all bg-white/5 text-gray-300 border border-white/10 hover:border-blue-500/30 hover:text-blue-300"
                aria-expanded={showAllTechs}
              >
                {showAllTechs ? "접기" : `+ ${hiddenTechCount}개 더보기`}
              </button>
            )}
          </div>
        </div>

        {/* Project cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {groupedProjects.map((group, groupIndex) => {
              const sectionOffset = groupedProjects
                .slice(0, groupIndex)
                .reduce((sum, item) => sum + item.projects.length, 0);

              return (
                <section key={group.id}>
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {group.desc}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {group.projects.length}개
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.projects.map((project, i) =>
                      renderProjectCard(project, i, sectionOffset)
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
