"use client";

import Link from "next/link";
import useLivePortfolioData from "@/components/useLivePortfolioData";
import type { PortfolioData } from "@/lib/portfolio";

export default function LiveContactPage({ initialData }: { initialData: PortfolioData }) {
  const { contact, hero } = useLivePortfolioData(initialData);

  return (
    <>
      <section className="min-h-[calc(100svh-4rem)] px-4 pb-20 pt-32 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">CONTACT</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              함께 이야기하고 싶은 일이 있다면 편하게 연락해주세요.
            </h1>
            <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 ink-muted">
              {contact.desc}
            </p>
          </div>

          <div className="surface rounded-md p-6 sm:p-8">
            <div className="space-y-6">
              <ContactLink label="Email" value={contact.email} href={`mailto:${contact.email}`} />
              <ContactLink label="GitHub" value="FutureAria repositories" href={contact.github} />
              <ContactLink label="Notion" value="개인 홈페이지 / 기록" href={contact.homepage} />
              {hero.resumeFile && <ContactLink label="Resume" value="이력서 PDF 다운로드" href={hero.resumeFile} download />}
              {hero.coverLetterFile && <ContactLink label="Cover Letter" value="자기소개서 PDF 다운로드" href={hero.coverLetterFile} download />}
              {contact.phone && (
                <div className="border-t hairline pt-6">
                  <p className="text-xs font-medium tracking-[0.18em] text-[color:var(--accent-strong)]">PHONE</p>
                  <p className="mt-2 text-base">{contact.phone}</p>
                </div>
              )}
              <div className="border-t hairline pt-6">
                <p className="text-xs font-medium tracking-[0.18em] text-[color:var(--accent-strong)]">LOCATION</p>
                <p className="mt-2 text-base">{contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t hairline px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-base font-semibold">프로젝트 흐름을 먼저 확인하고 싶다면</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 ink-muted">
              각 프로젝트 상세에는 맡은 역할, 문제 해결 과정, 사용 기술, 이미지 기록을 함께 정리해두었습니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/projects" className="inline-flex h-11 items-center justify-center rounded-md border hairline px-5 text-sm font-semibold">
              포트폴리오 보기
            </Link>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex h-11 items-center justify-center rounded-md bg-[color:var(--text)] px-5 text-sm font-semibold text-[color:var(--bg)]"
            >
              메일 보내기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactLink({ label, value, href, download = false }: { label: string; value: string; href: string; download?: boolean }) {
  if (!href) return null;
  const isExternal = !href.startsWith("mailto:") && !href.startsWith("/");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      download={download && href.startsWith("/") ? true : undefined}
      className="block border-t hairline pt-6"
    >
      <p className="text-xs font-medium tracking-[0.18em] text-[color:var(--accent-strong)]">{label}</p>
      <p className="mt-2 break-words text-base transition hover:text-[color:var(--accent-strong)]">{value}</p>
    </a>
  );
}
