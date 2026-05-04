"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ProjectScreenshotGalleryProps {
  projectTitle: string;
  screenshots: string[];
}

export default function ProjectScreenshotGallery({
  projectTitle,
  screenshots,
}: ProjectScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage =
    selectedIndex === null ? null : screenshots[selectedIndex] || null;

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? current
            : (current - 1 + screenshots.length) % screenshots.length
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? current : (current + 1) % screenshots.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [screenshots.length, selectedIndex]);

  if (screenshots.length === 0) return null;

  const showPrevious = () => {
    setSelectedIndex((current) =>
      current === null
        ? current
        : (current - 1 + screenshots.length) % screenshots.length
    );
  };

  const showNext = () => {
    setSelectedIndex((current) =>
      current === null ? current : (current + 1) % screenshots.length
    );
  };

  return (
    <>
      <section className="mb-12">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-4">
          스크린샷
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {screenshots.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className="rounded-xl overflow-hidden border border-[var(--border-color)] relative h-48 sm:h-56 group text-left focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
              aria-label={`${projectTitle} 스크린샷 ${i + 1} 크게 보기`}
            >
              <Image
                src={img}
                alt={`${projectTitle} 스크린샷 ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>크게 보기</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 px-4 py-5 backdrop-blur-md sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} 스크린샷 크게 보기`}
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative flex h-full w-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300">
                  Screenshot {selectedIndex + 1} / {screenshots.length}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {projectTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="이미지 닫기"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-black">
              <Image
                src={selectedImage}
                alt={`${projectTitle} 스크린샷 ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {screenshots.length > 1 && (
              <div className="pointer-events-none absolute inset-y-16 left-0 right-0 flex items-center justify-between px-2 sm:px-4">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/70"
                  aria-label="이전 스크린샷"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/70"
                  aria-label="다음 스크린샷"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
