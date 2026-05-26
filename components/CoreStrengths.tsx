"use client";

import { useEffect, useRef, useState } from "react";

const strengths = [
  {
    title: "API 설계와 서버 구조 이해",
    description:
      "웹 서비스 프로젝트를 통해 API 설계와 서버 구조에 대한 이해를 쌓아왔습니다.",
    accent: "from-blue-500/20 to-cyan-400/20",
    border: "border-blue-500/20",
    text: "text-blue-300",
  },
  {
    title: "데이터 처리와 DB 구조 고려",
    description:
      "데이터 처리 흐름과 DB 구조를 고려하며 기능을 구현하는 데 익숙합니다.",
    accent: "from-emerald-500/20 to-teal-400/20",
    border: "border-emerald-500/20",
    text: "text-emerald-300",
  },
  {
    title: "안정적인 서비스 운영 관심",
    description:
      "트랜잭션 처리와 데이터 정합성처럼 안정적인 서비스 운영에 필요한 요소에 관심이 많습니다.",
    accent: "from-amber-500/20 to-orange-400/20",
    border: "border-amber-500/20",
    text: "text-amber-300",
  },
  {
    title: "AI 도구 활용",
    description:
      "AI 도구를 활용해 학습 속도를 높이고 구현 과정의 문제를 빠르게 분석하고 있습니다.",
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
            핵심 역량
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            핵심 <span className="gradient-text">역량</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6" />
          <p className="readable-copy text-gray-400 text-base max-w-3xl mx-auto leading-8 text-center">
            프로젝트를 수행하며 꾸준히 쌓아온 백엔드 중심 역량을 정리했습니다.
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
