"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeroData {
  badge: string;
  name: string;
  subtitle: string;
  resumeFile?: string;
  email?: string;
}

const HERO_INTRO = [
  "백엔드, 데이터 흐름, 배포까지 직접 다루며 문제를 작동하는 화면으로 설명합니다.",
  "면접관이 빠르게 확인할 수 있도록 대표 프로젝트 3개를 먼저 배치했습니다.",
];

const RECOMMENDED_PROJECTS = [
  {
    href: "/projects/4",
    title: "BASE CHAIN",
    body: "코드 통합, MOCK 결제, QR 입장",
  },
  {
    href: "/projects/3",
    title: "KIS AI Trader",
    body: "AI 판단 근거와 운영 안전장치",
  },
  {
    href: "/projects/6",
    title: "MajorLink",
    body: "MVP 범위와 기획 검증",
  },
];

export default function Hero({ data }: { data: HeroData }) {
  const [visible] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    RECOMMENDED_PROJECTS.forEach((project) => router.prefetch(project.href));
  }, [router]);

  useEffect(() => {
    if (previewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [previewOpen]);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    <section className="relative flex min-h-[92svh] items-center overflow-hidden px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 supports-[height:92dvh]:min-h-[92dvh]">
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="text-left">
          <div
            className={`mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold leading-5 text-blue-300 transition-all duration-700 sm:px-4 sm:text-sm ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {data.badge}
          </div>

          <h1
            className={`mobile-safe-wrap mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white transition-all duration-700 delay-100 sm:text-5xl lg:text-6xl ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            문제를 쪼개고,
            <span className="gradient-text block">구조로 증명합니다.</span>
          </h1>

          <p
            className={`readable-copy mobile-safe-wrap mb-6 max-w-2xl text-base leading-8 text-gray-300 transition-all duration-700 delay-200 sm:text-lg ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {HERO_INTRO.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <div
            className={`mb-8 grid gap-3 text-sm text-gray-300 transition-all duration-700 delay-300 sm:grid-cols-2 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {[
              "API, DB, 배포 흐름을 프로젝트로 검증",
              "KIS는 개인 프로젝트, 주문 권한은 잠금",
              "BASE CHAIN은 최신 시연본 통합",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="leading-7">{item}</span>
              </div>
            ))}
          </div>

          <div
            className={`mb-5 flex flex-wrap items-center gap-2 text-xs transition-all duration-700 delay-[420ms] ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="font-semibold uppercase tracking-[0.18em] text-emerald-300">
              바로 볼 프로젝트
            </span>
            {RECOMMENDED_PROJECTS.map((project, index) => (
              <Link
                key={project.href}
                href={project.href}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-semibold text-gray-300 transition-colors hover:border-emerald-400/25 hover:text-white"
              >
                {index + 1}. {project.title}
              </Link>
            ))}
          </div>

          <div
            className={`flex flex-col gap-3 transition-all duration-700 delay-500 sm:flex-row sm:items-center ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <button
              onClick={() => handleScrollTo("projects")}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-emerald-600 hover:shadow-blue-500/40 active:translate-y-0 sm:w-auto"
            >
              대표 프로젝트 보기
            </button>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="hero-email-cta mobile-safe-wrap inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/5 hover:text-white active:translate-y-0 sm:w-auto"
              >
                <svg className="h-4 w-4 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                연락하기
              </a>
            )}
          </div>

          {data.resumeFile && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                이력서 미리보기
              </button>
              <a
                href={data.resumeFile}
                download
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                이력서 다운로드
              </a>
            </div>
          )}
        </div>

        <div
          className={`relative transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          aria-label="백엔드 문제 해결 흐름"
        >
          <div className="hero-map-shell rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
            <div className="mb-6 flex flex-col items-start gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Interview Route
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  가장 먼저 볼 3개
                </h2>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Human Verified
              </span>
            </div>

            <div className="space-y-3">
              {[
                ["01", "BASE CHAIN", "코드 통합, MOCK 결제, QR 입장"],
                ["02", "KIS AI Trader", "개인 프로젝트, 판단 근거, 주문 잠금"],
                ["03", "MajorLink", "MVP 범위, 일정, 역할, 비용 정리"],
              ].map(([number, title, body]) => (
                <div
                  key={number}
                  className="hero-map-step grid grid-cols-[2.75rem_1fr] gap-3 rounded-2xl border border-white/10 bg-gray-950/40 p-3"
                >
                  <span className="hero-map-token flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-xs font-black text-blue-200">
                    {number}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="hero-map-step-copy mt-1 text-sm leading-6 text-gray-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                클릭해서 상세 보기
              </p>
              <div className="mt-3 grid gap-2">
                {RECOMMENDED_PROJECTS.map((project, index) => (
                  <Link
                    key={project.href}
                    href={project.href}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 transition-colors hover:border-emerald-400/25 hover:bg-white/[0.06]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-200">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-white">
                        {project.title}
                      </span>
                      <span className="mobile-safe-wrap mt-0.5 block text-xs leading-5 text-gray-400">
                        {project.body}
                      </span>
                    </span>
                    <svg className="ml-auto h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 이력서 미리보기 모달 */}
    {previewOpen && data.resumeFile && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setPreviewOpen(false)}
      >
        <div
            className="relative w-full max-w-4xl h-[88dvh] max-h-[900px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <span className="text-sm font-semibold text-white">이력서 미리보기</span>
            <div className="flex items-center gap-3">
              <a
                href={data.resumeFile}
                download
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                다운로드
              </a>
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <iframe
            src={data.resumeFile}
            className="w-full h-full"
            title="이력서"
          />
        </div>
      </div>
    )}
    </>
  );
}
