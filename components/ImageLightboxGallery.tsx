"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageLightboxGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activeDisplayIndex = activeIndex ?? 0;
  const visibleImages = showAll ? images : images.slice(0, 6);
  const hiddenCount = Math.max(images.length - visibleImages.length, 0);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index === null ? index : Math.min(images.length - 1, index + 1)));
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index === null ? index : Math.max(0, index - 1)));
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visibleImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[16/10] overflow-hidden rounded-md border hairline bg-[color:var(--bg-soft)] text-left"
          >
            <Image
              src={src}
              alt={`${title} 이미지 ${index + 1}`}
              fill
              unoptimized={src.startsWith("/uploads/")}
              className="object-cover transition duration-700 group-hover:scale-[1.035]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span className="absolute bottom-3 right-3 rounded-md bg-[color:var(--bg)]/85 px-3 py-1 text-xs font-semibold backdrop-blur">
              크게 보기
            </span>
          </button>
        ))}
      </div>
      {images.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="mt-5 inline-flex h-11 items-center rounded-md border hairline px-5 text-sm font-semibold transition hover:bg-[color:var(--bg-soft)]"
        >
          {showAll ? "이미지 접기" : `이미지 ${hiddenCount}장 더 보기`}
        </button>
      )}

      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} 이미지 확대 보기`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/82 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div className="relative h-[78svh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activeImage}
              alt={`${title} 확대 이미지`}
              fill
              unoptimized={activeImage.startsWith("/uploads/")}
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 text-white">
            <p className="text-sm font-semibold">
              {activeDisplayIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="h-10 rounded-md border border-white/30 px-4 text-sm font-semibold backdrop-blur"
            >
              닫기
            </button>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((index) => (index === null ? index : Math.max(0, index - 1)));
            }}
            className="absolute left-4 top-1/2 hidden h-11 -translate-y-1/2 rounded-md border border-white/30 px-4 text-sm font-semibold text-white backdrop-blur sm:block"
          >
            이전
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((index) => (index === null ? index : Math.min(images.length - 1, index + 1)));
            }}
            className="absolute right-4 top-1/2 hidden h-11 -translate-y-1/2 rounded-md border border-white/30 px-4 text-sm font-semibold text-white backdrop-blur sm:block"
          >
            다음
          </button>
        </div>
      )}
    </>
  );
}
