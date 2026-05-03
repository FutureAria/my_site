"use client";

import Image from "next/image";
import Link from "next/link";
import ImageLightboxGallery from "@/components/ImageLightboxGallery";
import useLivePortfolioData from "@/components/useLivePortfolioData";
import type { PortfolioData } from "@/lib/portfolio";

export default function LiveProjectDetailPage({ initialData, projectIndex }: { initialData: PortfolioData; projectIndex: number }) {
  const data = useLivePortfolioData(initialData);
  const project = data.projects[projectIndex] || initialData.projects[projectIndex];

  if (!project) {
    return (
      <article className="px-4 pb-24 pt-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/projects" className="text-sm font-semibold text-[color:var(--accent-strong)]">
            프로젝트 목록으로
          </Link>
          <p className="mt-8 text-base ink-muted">프로젝트를 찾을 수 없습니다.</p>
        </div>
      </article>
    );
  }

  const images = project.detail?.images || [];
  const challengeText = project.detail?.challenges || "프로젝트를 진행하며 마주한 문제와 해결 과정을 정리하는 중입니다.";
  const takeaways = project.detail?.takeaways?.length
    ? project.detail.takeaways
    : [
        "문제를 재현하고 원인을 좁히는 과정",
        "데이터 흐름과 예외 상황을 먼저 정리하는 습관",
        "다음 작업자가 읽을 수 있는 기록의 중요성",
      ];

  return (
    <article className="px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/projects" className="text-sm font-semibold text-[color:var(--accent-strong)]">
          프로젝트 목록으로
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm ink-muted">{project.period}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 text-lg leading-8 ink-muted">{project.desc}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border hairline bg-[color:var(--bg-soft)]">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                unoptimized={project.image.startsWith("/uploads/")}
                className="object-cover"
                sizes="60vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center ink-muted">Project Preview</div>
            )}
          </div>
        </div>

        <div className="mt-16 border-t hairline pt-12">
          <aside className="grid gap-8 lg:grid-cols-[1.15fr_1fr_0.85fr_auto] lg:items-start">
            <div className="border-t hairline pt-5">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">ROLE</h2>
              <p className="mt-3 text-sm leading-7 ink-muted">{project.detail?.role || "프로젝트 구현과 개선에 참여했습니다."}</p>
            </div>
            <div className="border-t hairline pt-5">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">TECH</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techs.map((tech) => (
                  <span key={tech} className="rounded-full border hairline px-3 py-1 text-xs ink-muted">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t hairline pt-5">
              <h2 className="text-sm font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">RECORD</h2>
              <p className="mt-3 text-sm leading-7 ink-muted">
                기능, 문제 해결, 이미지 기록과 외부 자료로 프로젝트의 흐름을 확인할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:pt-5">
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--text)] px-5 text-sm font-semibold text-[color:var(--bg)]">
                  서버 보기
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md border hairline px-5 text-sm font-semibold">
                  GitHub 보기
                </a>
              )}
              {project.document && (
                <a href={project.document} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-md border hairline px-5 text-sm font-semibold">
                  {project.documentLabel || "PDF 설명서"}
                </a>
              )}
            </div>
          </aside>

          <div className="mt-14 space-y-12">
            <section className="rounded-md border hairline p-5 sm:p-7">
              <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">01 FEATURES</p>
              <h2 className="mt-3 text-2xl font-semibold">주요 기능</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(project.detail?.features || []).map((feature) => (
                  <div key={feature} className="border-t hairline pt-4 text-sm leading-7 ink-muted">
                    {feature}
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-md border hairline p-5 sm:p-7">
              <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">02 PROCESS</p>
              <h2 className="mt-3 text-2xl font-semibold">문제와 해결</h2>
              <p className="mt-5 whitespace-pre-line text-base leading-8 ink-muted">
                {challengeText}
              </p>
            </section>
            <section className="rounded-md border hairline p-5 sm:p-7">
              <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">03 TAKEAWAYS</p>
              <h2 className="mt-3 text-2xl font-semibold">배운 점</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {takeaways.map((item) => (
                  <div key={item} className="border-t hairline pt-4 text-sm leading-7 ink-muted">
                    {item}
                  </div>
                ))}
              </div>
            </section>
            {images.length > 0 && (
              <section className="rounded-md border hairline p-5 sm:p-7">
                <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">04 IMAGES</p>
                <h2 className="mt-3 text-2xl font-semibold">이미지 기록</h2>
                <p className="mt-3 text-sm leading-7 ink-muted">작업 화면과 과정 이미지를 순서대로 정리했습니다.</p>
                <ImageLightboxGallery images={images} title={project.title} />
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
