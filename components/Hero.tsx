"use client";

import { useEffect, useState } from "react";

interface HeroData {
  badge: string;
  name: string;
  subtitle: string;
  resumeFile?: string;
}

export default function Hero({ data }: { data: HeroData }) {
  const [visible, setVisible] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

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
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-0 pt-24 pb-10 sm:pt-28 sm:pb-16 supports-[height:100dvh]:min-h-[100dvh]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div
          className={`inline-flex max-w-full flex-wrap items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm font-medium leading-5 text-center mb-6 sm:mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {data.badge}
        </div>

        {/* Main heading */}
        <h1
          className={`mobile-safe-wrap text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5 sm:mb-6 transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          안녕하세요,{" "}
          <span className="gradient-text block sm:inline">{data.name}</span>
          입니다.
        </h1>

        {/* Subtitle */}
        <p
          className={`readable-copy mobile-clamp-3 text-sm sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-10 leading-7 sm:leading-9 text-center sm:text-left transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {data.subtitle}
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <button
            onClick={() => handleScrollTo("projects")}
            className="w-full max-w-xs sm:max-w-none sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            프로젝트 보기
          </button>
          <button
            onClick={() => handleScrollTo("contact-form")}
            className="w-full max-w-xs sm:max-w-none sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-gray-300 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            연락하기
          </button>
          {data.resumeFile && (
            <>
              <button
                onClick={() => setPreviewOpen(true)}
                className="w-full max-w-xs sm:max-w-none sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-gray-300 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                이력서 미리보기
              </button>
              <a
                href={data.resumeFile}
                download
                className="w-full max-w-xs sm:max-w-none sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-gray-300 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                이력서 다운로드
              </a>
            </>
          )}
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-14 hidden sm:flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-gray-600 text-xs tracking-widest uppercase">
            아래로 이동
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent animate-float" />
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
