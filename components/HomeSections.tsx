import Image from "next/image";
import Link from "next/link";
import type { PortfolioData, ProjectItem } from "@/lib/portfolio";

function getDisplayGalleryImages(data: PortfolioData): string[] {
  const projectImages = data.projects.flatMap((project) => [
    project.image,
    ...(project.detail?.images || []),
  ]);
  const timelineImages = data.about.timeline.map((item) => item.image || "");
  return Array.from(new Set([...projectImages, ...timelineImages].filter(Boolean)));
}

function ProjectImage({ project, index }: { project: ProjectItem; index: number }) {
  if (!project.image) {
    return (
      <div className="flex h-full min-h-56 items-center justify-center bg-[color:var(--bg-soft)]">
        <span className="text-sm ink-muted">Project {String(index + 1).padStart(2, "0")}</span>
      </div>
    );
  }

  return (
    <Image
      src={project.image}
      alt={project.title}
      fill
      unoptimized={project.image.startsWith("/uploads/")}
      className="object-cover transition duration-700 group-hover:scale-[1.035]"
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={index === 0}
    />
  );
}

export function HeroMagazine({ data }: { data: PortfolioData }) {
  const home = data.settings?.home || {};
  const fallbackImages = getDisplayGalleryImages(data).slice(0, 4);
  const heroImages = home.collageImages?.length ? home.collageImages : fallbackImages;

  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden px-4 pb-14 pt-32 sm:px-6 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="max-w-[42rem] reveal">
          <p className="mb-5 text-xs font-semibold tracking-[0.24em] text-[color:var(--accent-strong)] sm:text-sm">
            {home.eyebrow || "PORTFOLIO ARCHIVE"}
          </p>
          <h1 className="display-title max-w-[11ch] text-[3.05rem] font-semibold sm:text-[4.8rem] lg:text-[5.8rem]">
            {home.headline || "기록하고, 만들고, 오래 남기는 사람"}
          </h1>
          <p className="mt-7 max-w-[35rem] text-[0.98rem] leading-8 ink-muted sm:text-base">
            {home.description || "프로젝트, 생각, 이미지와 경험을 차분히 모아둔 개인 포트폴리오입니다. 데이터 흐름과 API 설계, 그리고 오래 읽히는 기록을 함께 고민합니다."}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[color:var(--text)] px-6 text-sm font-semibold text-[color:var(--bg)] transition hover:opacity-86"
            >
              {home.primaryCtaLabel || "포트폴리오 보기"}
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border hairline px-6 text-sm font-semibold transition hover:bg-[color:var(--bg-soft)]"
            >
              {home.secondaryCtaLabel || "나에 대해"}
            </Link>
          </div>
        </div>

        <div className="relative h-[24rem] reveal reveal-delay sm:h-[31rem] lg:h-[37rem]">
          <div className="absolute left-0 top-8 h-44 w-[47%] overflow-hidden rounded-md border hairline sm:h-72">
            {heroImages[0] && <Image src={heroImages[0]} alt="작업 이미지" fill unoptimized={heroImages[0].startsWith("/uploads/")} className="object-cover" sizes="50vw" priority />}
          </div>
          <div className="absolute right-0 top-0 h-52 w-[46%] overflow-hidden rounded-md border hairline sm:h-80">
            {heroImages[1] && <Image src={heroImages[1]} alt="프로젝트 이미지" fill unoptimized={heroImages[1].startsWith("/uploads/")} className="object-cover" sizes="50vw" priority />}
          </div>
          <div className="absolute bottom-10 left-[13%] h-40 w-[38%] overflow-hidden rounded-md border hairline sm:h-60">
            {heroImages[2] && <Image src={heroImages[2]} alt="기록 이미지" fill unoptimized={heroImages[2].startsWith("/uploads/")} className="object-cover" sizes="45vw" />}
          </div>
          <div className="absolute bottom-0 right-[6%] min-h-36 w-[42%] overflow-hidden rounded-md border hairline bg-[color:var(--bg-soft)] p-4 sm:h-52 sm:w-[37%] sm:p-5">
            <p className="text-xs font-medium tracking-[0.18em] text-[color:var(--champagne)]">{home.noteLabel || "NOTE"}</p>
            <p className="mt-3 text-sm leading-6 sm:mt-4 sm:text-lg sm:leading-7">
              {home.noteText || "작은 문제를 끝까지 관찰하고, 해결 과정을 다음 사람이 읽을 수 있게 남깁니다."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects({ projects }: { projects: Array<ProjectItem & { originalIndex?: number }> }) {
  return (
    <section className="section-pad border-t hairline">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">FEATURED</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">대표 프로젝트</h2>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-[color:var(--accent-strong)]">
            전체 프로젝트 보기
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <Link key={project.title} href={`/projects/${project.originalIndex ?? index}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border hairline">
                <ProjectImage project={project} index={index} />
              </div>
              <div className="mt-5 border-t hairline pt-5">
                <p className="text-xs ink-muted">{project.period}</p>
                <h3 className="mt-2 text-xl font-semibold leading-7">{project.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 ink-muted">{project.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techs.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-full border hairline px-3 py-1 text-xs ink-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview({ data }: { data: PortfolioData }) {
  return (
    <section className="section-pad border-t hairline">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">ABOUT</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">저는 이런 흐름으로 성장하고 있습니다.</h2>
        </div>
        <div>
          <p className="max-w-3xl text-base leading-8 ink-muted">
            컴퓨터공학을 전공하며 데이터베이스, 서버 구조, API 설계에 관심을 두고 공부하고 있습니다.
            프로젝트를 구현하는 과정에서 문제를 발견하고, 해결 과정까지 기록하는 습관을 중요하게 생각합니다.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {["데이터 흐름", "API 설계", "기록하는 개발"].map((keyword) => (
              <div key={keyword} className="border-t hairline pt-4">
                <p className="text-base font-semibold">{keyword}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="mt-9 inline-flex h-11 items-center rounded-md border hairline px-5 text-sm font-semibold">
            소개 더 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

export function JournalGalleryPreview({ data }: { data: PortfolioData }) {
  return (
    <section className="section-pad border-t hairline">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div id="journal">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">JOURNAL</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">문제를 해결하며 남긴 기록</h2>
          <Link href="/journal" className="mt-8 inline-flex h-11 items-center rounded-md border hairline px-5 text-sm font-semibold">
            기록 전체 보기
          </Link>
        </div>
        <div className="space-y-7">
          {data.blog.slice(0, 3).map((post) => (
            <article key={post.title} className="border-t hairline pt-6">
              <p className="text-xs ink-muted">{post.date}</p>
              <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 ink-muted">{post.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactTeaser({ email }: { email: string }) {
  return (
    <section className="section-pad border-t hairline">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">CONTACT</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
            프로젝트와 기록에 대해 이야기하고 싶다면 편하게 연락해주세요.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 ink-muted">
            작업 과정과 문제 해결 방식까지 차분히 공유할 수 있습니다.
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-9 inline-flex h-12 items-center rounded-md bg-[color:var(--text)] px-6 text-sm font-semibold text-[color:var(--bg)]"
          >
            메일 보내기
          </a>
        </div>
      </div>
    </section>
  );
}
