"use client";

import useLivePortfolioData from "@/components/useLivePortfolioData";
import type { PortfolioData } from "@/lib/portfolio";

export default function LiveJournalPage({ initialData }: { initialData: PortfolioData }) {
  const data = useLivePortfolioData(initialData);

  return (
    <div className="space-y-10">
      {data.blog.map((post, index) => (
        <article key={`${post.date}-${post.title}`} className="grid gap-6 border-t hairline pt-8 lg:grid-cols-[0.24fr_1fr]">
          <div>
            <p className="text-sm ink-muted">{post.date}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border hairline px-3 py-1 text-xs ink-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold leading-snug">{post.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 ink-muted">{post.summary}</p>
            <details id={`post-${index}`} className="group mt-5 max-w-3xl">
              <summary className="inline-flex cursor-pointer list-none text-sm font-semibold text-[color:var(--accent-strong)]">
                <span className="group-open:hidden">기록 펼치기</span>
                <span className="hidden group-open:inline">기록 접기</span>
              </summary>
              <div className="mt-8 whitespace-pre-line border-l-2 border-[color:var(--line)] pl-5 text-sm leading-8 ink-muted">
                {post.content
                  .replaceAll("## ", "")
                  .replaceAll("```sql", "")
                  .replaceAll("```jsx", "")
                  .replaceAll("```python", "")
                  .replaceAll("```", "")}
              </div>
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
