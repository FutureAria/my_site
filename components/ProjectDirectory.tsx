"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProjectItem } from "@/lib/portfolio";

export default function ProjectDirectory({ projects }: { projects: ProjectItem[] }) {
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("All");
  const [showAllTechs, setShowAllTechs] = useState(false);

  const techs = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((project) => project.techs)))],
    [projects],
  );

  const filtered = projects.filter((project) => {
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.desc.toLowerCase().includes(q) ||
      project.techs.some((item) => item.toLowerCase().includes(q));
    const matchTech = tech === "All" || project.techs.includes(tech);
    return matchQuery && matchTech;
  });

  const visibleTechs = showAllTechs ? techs : techs.slice(0, 9);
  const hiddenTechCount = Math.max(techs.length - visibleTechs.length, 0);

  const filterButtons = (
    <>
      {visibleTechs.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setTech(item)}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
            tech === item
              ? "border-[color:var(--text)] bg-[color:var(--text)] text-[color:var(--bg)]"
              : "hairline ink-muted hover:text-[color:var(--text)]"
          }`}
        >
          {item === "All" ? "전체" : item}
        </button>
      ))}
      {techs.length > 9 && (
        <button
          type="button"
          onClick={() => setShowAllTechs((value) => !value)}
          className="rounded-full border hairline px-4 py-2 text-xs font-semibold text-[color:var(--accent-strong)] transition hover:bg-[color:var(--bg-soft)]"
        >
          {showAllTechs ? "접기" : `더보기 ${hiddenTechCount}`}
        </button>
      )}
    </>
  );

  return (
    <div>
      <div className="border-y hairline px-4 py-5 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(18rem,28rem)_1fr] lg:items-start">
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">프로젝트 검색</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="프로젝트, 기술, 설명 검색"
              className="h-12 w-full rounded-md border hairline bg-transparent px-4 text-sm outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
            />
          </label>
          <div className="min-w-0">
            <details className="rounded-md border hairline p-3 lg:hidden">
              <summary className="cursor-pointer list-none text-sm font-semibold">
                필터 보기 {tech !== "All" ? `· ${tech}` : ""}
              </summary>
              <div className="mt-3 flex flex-wrap gap-2">{filterButtons}</div>
            </details>
            <div className="hidden flex-wrap gap-2 lg:flex">
              {filterButtons}
            </div>
            {tech !== "All" && (
              <button
                type="button"
                onClick={() => setTech("All")}
                className="mt-3 text-xs font-semibold text-[color:var(--accent-strong)]"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const originalIndex = projects.indexOf(project);
            return (
              <Link key={project.title} href={`/projects/${originalIndex}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border hairline bg-[color:var(--bg-soft)]">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      unoptimized={project.image.startsWith("/uploads/")}
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm ink-muted">
                      Project {String(originalIndex + 1).padStart(2, "0")}
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <p className="text-xs ink-muted">{project.period}</p>
                  <h2 className="mt-2 text-xl font-semibold leading-7">{project.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 ink-muted">{project.desc}</p>
                  {project.detail?.role && (
                    <p className="mt-4 border-l-2 border-[color:var(--accent)] pl-4 text-sm leading-7 ink-muted">
                      {project.detail.role}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techs.slice(0, 5).map((item) => (
                      <span key={item} className="rounded-full border hairline px-3 py-1 text-xs ink-muted">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="mx-auto max-w-7xl py-24 text-center ink-muted">
            검색 결과가 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
