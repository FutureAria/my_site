"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const problems = [
  {
    title: "동시에 신청해도 정원이 초과되지 않게 하려면?",
    project: "수강신청 웹 플랫폼",
    href: "/projects/0",
    point: "장바구니에서 신청 처리까지 이어지는 DB 흐름과 동시성 기준을 정리했습니다.",
  },
  {
    title: "등록·수정·삭제 후 화면 상태가 어긋나는 이유는?",
    project: "물품 관리 웹 시스템",
    href: "/projects/1",
    point: "API 응답을 기준으로 목록 상태가 다시 맞춰지도록 CRUD 흐름을 정리했습니다.",
  },
  {
    title: "공공 데이터는 어떻게 추천 결과가 될 수 있을까?",
    project: "AI 상권 분석 서비스",
    href: "/projects/2",
    point: "수집, 정제, 저장, 분석 API를 거쳐 추천 결과로 연결되는 구조를 만들었습니다.",
  },
  {
    title: "배포된 서비스는 어떻게 계속 고치고 운영할까?",
    project: "KIS AI 트레이더",
    href: "/projects/3",
    point: "읽기모드, 관리자 화면, 배포 로그, 검증 단계를 나눠 운영 흐름을 관리했습니다.",
  },
];

export default function ProblemSolving() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.14 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problems" ref={ref} className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div
          className={`mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Problem First
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                제가 풀어본 <span className="gradient-text">문제들</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                프로젝트를 기능 이름이 아니라 해결한 문제 기준으로 먼저 보이도록 정리했습니다.
              </p>
            </div>
            <Link
              href="#projects"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-blue-400/30 hover:bg-white/5 hover:text-white"
            >
              전체 프로젝트 보기
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {problems.map((problem, index) => (
            <Link
              key={problem.title}
              href={problem.href}
              className={`group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-all duration-700 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.055] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${120 + index * 90}ms` }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-xs font-black text-blue-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-emerald-300">
                  {problem.project}
                </span>
              </div>
              <h3 className="mobile-safe-wrap text-xl font-bold leading-8 text-white">
                {problem.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                {problem.point}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
