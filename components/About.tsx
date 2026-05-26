"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TimelineItem {
  year: string;
  title: string;
  summary?: string;
  desc: string;
  type: string;
  image?: string;
  certificateImage?: string;
  certificateFile?: string;
  documents?: TimelineDocument[];
  subjects?: string[];
}

interface TimelineDocument {
  title?: string;
  description?: string;
  file?: string;
  preview?: string;
  type?: string;
}

interface AboutData {
  intro: string;
  timeline: TimelineItem[];
}

const timelineTypeMeta: Record<
  string,
  { label: string; badgeClass: string }
> = {
  education: {
    label: "학력",
    badgeClass: "bg-blue-500/15 text-blue-300",
  },
  training: {
    label: "교육",
    badgeClass: "bg-emerald-500/15 text-emerald-300",
  },
  career: {
    label: "경력",
    badgeClass: "bg-cyan-500/15 text-cyan-300",
  },
  award: {
    label: "수상",
    badgeClass: "bg-fuchsia-500/15 text-fuchsia-300",
  },
  certificate: {
    label: "자격증",
    badgeClass: "bg-amber-500/15 text-amber-300",
  },
};

export default function About({ data }: { data: AboutData }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleTimeline = (index: number) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-3 block">
            소개
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            성장 <span className="gradient-text">기록</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto" />
        </div>

        {/* About intro */}
        <div
          className={`glass rounded-2xl p-6 sm:p-8 mb-12 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="readable-copy whitespace-pre-line text-gray-300 leading-8 text-base sm:text-lg text-left">
            {data.intro}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-transparent" />
          <div className="space-y-10">
            {data.timeline.map((item, i) => (
              <div
                key={i}
                className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                <div
                  className={`hidden sm:flex sm:w-1/2 ${i % 2 === 0 ? "justify-end pr-8" : "order-2 pl-8"}`}
                >
                  <TimelineCard
                    item={item}
                    isExpanded={Boolean(expandedItems[i])}
                    onToggle={() => toggleTimeline(i)}
                  />
                </div>
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 border-4 border-gray-950 z-10 mt-1" />
                <div
                  className={`hidden sm:flex sm:w-1/2 ${i % 2 === 0 ? "order-2 pl-8" : "justify-end pr-8"}`}
                >
                  <span className="text-sm text-gray-500 font-medium mt-2">
                    {item.year}
                  </span>
                </div>
                <div className="sm:hidden w-full pl-10">
                  <TimelineCard
                    item={item}
                    isExpanded={Boolean(expandedItems[i])}
                    onToggle={() => toggleTimeline(i)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: TimelineItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const meta = timelineTypeMeta[item.type] || timelineTypeMeta.training;
  const documents = item.documents || [];
  const hasEvidence = Boolean(
    item.certificateImage || item.certificateFile || documents.length > 0,
  );
  const subjects = item.subjects || [];
  const visibleSubjects = isExpanded ? subjects : subjects.slice(0, 3);
  const summaryLines = getTimelineSummaryLines(item);

  return (
    <article
      className={`glass rounded-xl p-4 sm:p-5 transition-all duration-300 max-w-md w-full ${
        isExpanded
          ? "border-blue-400/30 bg-white/[0.055]"
          : "hover:-translate-y-1 hover:bg-white/[0.06] hover:border-blue-400/25"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${item.title} 상세 기록 ${isExpanded ? "접기" : "열기"}`}
        className="w-full text-left group/card"
      >
        <div className="flex items-start gap-4">
          {item.image && (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 mt-1 relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${meta.badgeClass}`}
              >
                {meta.label}
              </span>
              {hasEvidence && (
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-200 border border-amber-400/10">
                  증빙/문서
                </span>
              )}
              <span className="sm:hidden text-xs text-gray-500">{item.year}</span>
            </div>
            <h3 className="text-white font-semibold text-base leading-7 sm:text-lg sm:leading-7 group-hover/card:gradient-text transition-all duration-300">
              {item.title}
            </h3>
            <ul className="mt-3 space-y-2 text-left">
              {summaryLines.map((line) => (
                <li
                  key={line}
                  className="readable-copy flex gap-2 text-sm leading-6 text-gray-400"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <span
            className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition-all duration-300 group-hover/card:border-blue-400/35 group-hover/card:text-white ${
              isExpanded ? "rotate-180 border-blue-400/35 text-white" : ""
            }`}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-gray-400 transition-colors group-hover/card:text-blue-200">
          <span>{isExpanded ? "상세 접기" : "3줄 요약 다음 기록 보기"}</span>
          <span className="text-blue-300">
            {isExpanded ? "닫기" : hasEvidence ? "증빙 열기" : "열기"}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
            detail note
          </p>
          <p className="readable-copy whitespace-pre-line text-gray-400 text-sm leading-7 text-left">
            {item.desc}
          </p>
        </div>
      )}

      {subjects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-gray-500 font-medium mb-2">주요 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {visibleSubjects.map((subject) => (
              <span
                key={subject}
                className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
              >
                {subject}
              </span>
            ))}
            {!isExpanded && subjects.length > visibleSubjects.length && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-200 border border-blue-400/10">
                +{subjects.length - visibleSubjects.length}
              </span>
            )}
          </div>
        </div>
      )}

      {isExpanded && hasEvidence && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
              evidence
            </p>
            <p className="text-xs text-gray-500">
              열람 / 다운로드 가능
            </p>
          </div>
          {item.certificateImage && (
            <a
              href={item.certificateImage}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg overflow-hidden border border-white/10 bg-white/[0.03] hover:border-blue-400/40 transition-colors"
              aria-label={`${item.title} 증빙 이미지 열기`}
            >
              <span className="relative block aspect-[16/9]">
                <Image
                  src={item.certificateImage}
                  alt={`${item.title} 증빙 이미지`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, 400px"
                />
              </span>
            </a>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {item.certificateImage && (
              <a
                href={item.certificateImage}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-gray-200 border border-white/10 hover:border-blue-400/40 hover:text-white transition-colors"
              >
                증빙 이미지 열기
              </a>
            )}
            {item.certificateFile && (
              <>
                <a
                  href={item.certificateFile}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-400/15 hover:border-blue-400/40 hover:text-white transition-colors"
                >
                  PDF 보기
                </a>
                <a
                  href={item.certificateFile}
                  download
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:border-emerald-400/40 hover:text-white transition-colors"
                >
                  PDF 다운로드
                </a>
              </>
            )}
          </div>
          {documents.length > 0 && (
            <div className="mt-3 space-y-2">
              {documents.map((doc, docIndex) => {
                const openUrl = doc.preview || doc.file || "";
                const typeLabel = getDocumentTypeLabel(doc.type, doc.file || doc.preview);
                return (
                  <div
                    key={`${doc.title || "문서"}-${docIndex}`}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {doc.title || `첨부 문서 ${docIndex + 1}`}
                        </p>
                        {doc.description && (
                          <p className="readable-copy mt-1 text-xs leading-5 text-gray-400">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase text-gray-300">
                        {typeLabel}
                      </span>
                    </div>
                    {openUrl && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={openUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-400/15 hover:border-blue-400/40 hover:text-white transition-colors"
                        >
                          문서 열기
                        </a>
                        {doc.file && (
                          <a
                            href={doc.file}
                            download
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:border-emerald-400/40 hover:text-white transition-colors"
                          >
                            다운로드
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function getTimelineSummaryLines(item: TimelineItem) {
  const source = item.summary || item.desc || item.title;
  const lines = source
    .split(/\n+/)
    .map((line) => line.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

  return (lines.length > 0 ? lines : [item.title]).slice(0, 3);
}

function getDocumentTypeLabel(type?: string, url?: string) {
  const value = type || url?.split(".").pop() || "file";
  return value.replace(/^\./, "").toUpperCase();
}
