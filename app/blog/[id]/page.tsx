import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

async function getData() {
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "portfolio.json"), "utf-8");
  return JSON.parse(raw);
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = parseInt(id, 10);
  const data = await getData();
  const post: BlogPost | undefined = (data.blog || [])[idx];

  if (!post) notFound();

  // 간단한 마크다운 → HTML 변환 (코드블록, 헤딩, 줄바꿈)
  const renderContent = (md: string) => {
    return md
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-white/5 rounded-xl p-4 overflow-x-auto text-sm my-4 border border-white/10"><code class="text-emerald-300">$2</code></pre>')
      .replace(/^## (.*)/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-white">$1</h2>')
      .replace(/^### (.*)/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-white">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/^- (.*)/gm, '<li class="flex items-start gap-2 text-gray-300 mb-1"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 inline-block"></span><span>$1</span></li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-8 text-left mb-4">')
      .replace(/^(?!<)(.+)/gm, (m) => m.startsWith('<') ? m : m);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/#blog"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            블로그로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-6">
          <time className="text-sm text-gray-500">{post.date}</time>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 leading-snug">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-[var(--border-color)]">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: `<p class="text-gray-300 leading-8 text-left mb-4">${renderContent(post.content)}</p>` }}
        />
      </main>
    </div>
  );
}
