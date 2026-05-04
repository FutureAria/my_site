"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  type: string;
  image?: string;
  certificateImage?: string;
  certificateFile?: string;
  subjects?: string[];
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
            학력 · 교육 · 경력 · 수상 · <span className="gradient-text">자격</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto" />
        </div>

        {/* About intro */}
        <div
          className={`glass rounded-2xl p-6 sm:p-8 mb-12 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="readable-copy text-gray-300 leading-8 text-base sm:text-lg text-left">
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
                  <TimelineCard item={item} />
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
                  <TimelineCard item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ item }: { item: TimelineItem }) {
  const meta = timelineTypeMeta[item.type] || timelineTypeMeta.training;
  const hasCertificate = Boolean(item.certificateImage || item.certificateFile);

  return (
    <div className="glass rounded-xl p-4 sm:p-5 hover:bg-white/[0.06] transition-all duration-300 group max-w-md w-full">
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
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-2 ${meta.badgeClass}`}
          >
            {meta.label}
          </span>
          {hasCertificate && (
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-2 ml-2 bg-amber-500/15 text-amber-200 border border-amber-400/10">
              증빙 있음
            </span>
          )}
          <span className="sm:hidden text-xs text-gray-500 ml-2">{item.year}</span>
          <h3 className="text-white font-semibold text-lg group-hover:gradient-text transition-all duration-300">
            {item.title}
          </h3>
          <p className="readable-copy text-gray-400 text-sm mt-1 leading-7 text-left">
            {item.desc}
          </p>
        </div>
      </div>
      {hasCertificate && (
        <div className="mt-4 pt-4 border-t border-white/5">
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
        </div>
      )}
      {item.subjects && item.subjects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-gray-500 font-medium mb-2">주요 과목</p>
          <div className="flex flex-wrap gap-1.5">
            {item.subjects.map((subject) => (
              <span
                key={subject}
                className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
