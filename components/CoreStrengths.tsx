"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const strengths = [
  {
    title: "API 흐름 설계",
    description:
      "화면 요청이 어떤 서버 응답과 상태 변화로 이어지는지 먼저 쪼개고, 기능별 책임을 나눕니다.",
    proof: "CRUD · KIS · BASE CHAIN",
    href: "/projects/1",
    accent: "from-blue-500/20 to-cyan-400/20",
    border: "border-blue-500/20",
    text: "text-blue-300",
  },
  {
    title: "DB 정합성 관점",
    description:
      "정원, 좌석, 추천 점수처럼 어긋나면 바로 문제가 되는 데이터를 기준으로 저장 흐름을 설계합니다.",
    proof: "수강신청 · 상권 분석 · 티켓 상태",
    href: "/projects/0",
    accent: "from-emerald-500/20 to-teal-400/20",
    border: "border-emerald-500/20",
    text: "text-emerald-300",
  },
  {
    title: "배포와 운영 기록",
    description:
      "Oracle, Caddy, DuckDNS, 로그 확인처럼 보여주는 데서 끝나지 않고 운영 환경까지 확인합니다.",
    proof: "KIS · BASE CHAIN · 포트폴리오",
    href: "/projects/3",
    accent: "from-amber-500/20 to-orange-400/20",
    border: "border-amber-500/20",
    text: "text-amber-300",
  },
  {
    title: "AI 활용 방식",
    description:
      "AI를 자동 결정자가 아니라 요구사항 정리, 판단 근거 요약, 검증 체크리스트 작성 도구로 씁니다.",
    proof: "KIS · 음악 추천 · 문서 정리",
    href: "/projects/5",
    accent: "from-purple-500/20 to-pink-400/20",
    border: "border-purple-500/20",
    text: "text-purple-300",
  },
];

export default function CoreStrengths() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section id="strengths" ref={ref} className="py-20 sm:py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-3 block">
            evidence
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            말로 끝나지 않는 <span className="gradient-text">근거</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6" />
          <p className="readable-copy text-gray-400 text-base max-w-3xl mx-auto leading-8 text-center">
            면접에서 바로 이어서 설명할 수 있도록 역량을 실제 프로젝트 증거와 묶었습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {strengths.map((item, index) => (
            <div
              key={item.title}
              className={`glass rounded-2xl p-5 sm:p-6 border ${item.border} transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${120 + index * 120}ms` }}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.accent} border ${item.border} flex items-center justify-center mb-4`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.text} bg-current`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
              <p className="readable-copy text-gray-400 text-sm leading-7 text-left">
                {item.description}
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className={`mb-3 text-xs font-semibold ${item.text}`}>
                  확인할 수 있는 프로젝트
                </p>
                <p className="text-sm leading-6 text-gray-300">{item.proof}</p>
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  근거 보기
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
