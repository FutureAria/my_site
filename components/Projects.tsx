"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GitHubStats from "./GitHubStats";

interface ProjectItem {
  title: string;
  period: string;
  desc: string;
  techs: string[];
  image: string;
  link: string;
  github: string;
  detail?: {
    role?: string;
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

const MOBILE_TECH_LIMIT = 4;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
          {filtered.map((project, i) => {
            const originalIndex = data.indexOf(project);
            const color = colors[originalIndex % colors.length];

            const card = (
              <div
                key={originalIndex}
                onClick={() => router.push(`/projects/${originalIndex}`)}
                className={`group relative glass rounded-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${150 + i * 150}ms` }}
              >
                {/* Card header - image or gradient */}
                {project.image ? (
                    <div className="h-40 sm:h-44 relative overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div
                    className={`h-32 bg-gradient-to-br ${color.gradient} flex items-center justify-center relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                    <div
                      className={`${color.accent} relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                        {icons[originalIndex % icons.length]}
                      </div>
                    </div>
                  </div>
                )}

                {/* Card body */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  <span className="inline-block text-xs text-gray-500 font-medium mb-3">
                    {project.period}
                  </span>
                  {project.detail?.role && (
                    <div className="mb-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                        역할
                      </p>
                      <p className="readable-copy mobile-clamp-2 mt-1 text-xs leading-6 text-gray-300 text-left">
                        {project.detail.role}
                      </p>
                    </div>
                  )}
                  <p className="readable-copy mobile-clamp-3 text-gray-400 text-sm leading-7 text-left mb-5">
                    {project.desc}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techs.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className={`text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5 group-hover:border-white/10 transition-colors ${
                          techIndex >= MOBILE_TECH_LIMIT ? "hidden sm:inline-flex" : ""
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techs.length > MOBILE_TECH_LIMIT && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5 sm:hidden">
                        +{project.techs.length - MOBILE_TECH_LIMIT}
                      </span>
                    )}
                  </div>

                  {/* GitHub stats */}
                  {project.github && <GitHubStats githubUrl={project.github} />}

                  {/* Links */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 border-t border-white/5">
                    <a
                      href={`/projects/${originalIndex}`}
                      className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      상세 보기
                    </a>
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
                        데모
                      </a>
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

            return card;
          })}
        </div>
      </div>
    </section>
  );
}
