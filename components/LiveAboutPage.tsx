"use client";

import Image from "next/image";
import useLivePortfolioData from "@/components/useLivePortfolioData";
import type { PortfolioData } from "@/lib/portfolio";

const typeLabel: Record<string, string> = {
  education: "학력",
  training: "교육",
  career: "경력",
  award: "수상",
  certificate: "자격",
};

export default function LiveAboutPage({ initialData }: { initialData: PortfolioData }) {
  const data = useLivePortfolioData(initialData);

  return (
    <>
      <section className="px-4 pb-16 pt-32 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">ABOUT</p>
            <h1 className="hangul-title mt-4 max-w-[11ch] text-[2.7rem] font-semibold leading-[1.14] sm:max-w-[12ch] sm:text-[4rem] lg:text-[4.45rem]">
              <span className="block">문제를</span>
              <span className="block pl-[0.45em]">관찰하고,</span>
              <span className="block pl-[0.9em]">흐름을 정리해</span>
              <span className="block pl-[1.35em]">다시 남깁니다.</span>
            </h1>
          </div>
          <div className="space-y-8">
            <p className="whitespace-pre-line text-base leading-8 ink-muted">
              {data.about.intro}
            </p>
            <p className="text-base leading-8 ink-muted">
              프로젝트를 만들 때는 기능 구현에서 멈추지 않고, 문제가 생긴 이유와 해결한 과정을 함께 남기려 합니다.
              지금 이 사이트도 그런 기록들을 한곳에 모으기 위한 개인 아카이브입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y hairline px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          {[
            ["관심 분야", "API 설계, 데이터베이스, 서버 구조"],
            ["작업 방식", "작게 구현하고, 흐름을 검증하고, 기록으로 남기기"],
            ["현재 방향", "안정적인 서버 구조와 실제 서비스 문제 해결"],
          ].map(([title, body]) => (
            <div key={title} className="border-t hairline pt-5">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">TIMELINE</p>
            <h2 className="hangul-title mt-3 text-3xl font-semibold sm:text-4xl">배움과 프로젝트의 흐름</h2>
          </div>
          <div className="space-y-8">
            {data.about.timeline.map((item) => (
              <article key={`${item.year}-${item.title}`} className="grid gap-6 border-t hairline pt-8 lg:grid-cols-[0.28fr_0.32fr_1fr]">
                <div>
                  <p className="text-sm ink-muted">{item.year}</p>
                  <span className="mt-3 inline-flex rounded-full border hairline px-3 py-1 text-xs ink-muted">
                    {typeLabel[item.type] || item.type}
                  </span>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border hairline bg-[color:var(--bg-soft)]">
                  {item.image && <Image src={item.image} alt={item.title} fill unoptimized={item.image.startsWith("/uploads/")} className="object-cover" sizes="30vw" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-4 whitespace-pre-line text-sm leading-8 ink-muted">{item.desc}</p>
                  {(item.subjects || []).length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.subjects?.map((subject) => (
                        <span key={subject} className="rounded-full border hairline px-3 py-1 text-xs ink-muted">
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t hairline">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">SKILLS</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data.skills).map(([group, skills]) => (
              <div key={group} className="border-t hairline pt-5">
                <h2 className="text-xl font-semibold">{group}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full border hairline px-3 py-1 text-xs ink-muted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
