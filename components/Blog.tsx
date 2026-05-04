"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

export default function Blog({ data }: { data: BlogPost[] }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <section id="blog" ref={ref} className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-3 block">
            아티클
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            기술 <span className="gradient-text">블로그</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6" />
          <p className="text-gray-400 text-sm">개발하면서 배운 것들을 기록합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((post, i) => (
            <article
              key={i}
              onClick={() => router.push(`/blog/${i}`)}
              className={`group glass rounded-2xl p-6 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${150 + i * 150}ms` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <time className="text-xs text-gray-500 font-medium">{post.date}</time>
              </div>
              <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-blue-300 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm leading-7 mb-4 line-clamp-3">
                {post.summary}
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
