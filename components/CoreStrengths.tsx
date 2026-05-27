"use client";

import { useEffect, useRef, useState } from "react";

const strengths = [
  {
    title: "상태가 꼬이지 않는 흐름 설계",
    description:
      "예매, 신청, 주문처럼 상태가 바뀌는 기능은 요청 순서와 권한 경계를 먼저 나눕니다.",
    accent: "from-blue-500/20 to-cyan-400/20",
    border: "border-blue-500/20",
    text: "text-blue-300",
  },
  {
    title: "깨지면 안 되는 데이터 기준",
    description:
      "정원, 티켓 상태, 판단 기록처럼 어긋나면 안 되는 데이터를 기준으로 DB와 화면을 맞춥니다.",
    accent: "from-emerald-500/20 to-teal-400/20",
    border: "border-emerald-500/20",
    text: "text-emerald-300",
  },
  {
    title: "배포 후 문제까지 직접 추적",
    description:
      "운영 URL, 캐시, 서비스워커, 빌드 오류처럼 배포 뒤에 보이는 문제도 로그와 화면으로 확인합니다.",
    accent: "from-amber-500/20 to-orange-400/20",
    border: "border-amber-500/20",
    text: "text-amber-300",
  },
  {
    title: "AI 결과를 검증 가능한 화면으로",
    description:
      "AI 판단은 그대로 믿지 않고 근거, 차단 이유, 읽기 전용 화면처럼 사람이 확인할 수 있게 정리합니다.",
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
            역량을 추상적으로 나열하지 않고, 프로젝트에서 실제로 다룬 문제 기준으로 정리했습니다.
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
