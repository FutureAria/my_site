import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo"); // e.g. "FutureAria/bu-blockchain"

  if (!repo) {
    return NextResponse.json({ error: "repo required" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) {
      return NextResponse.json({ stars: null, forks: null });
    }

    const data = await res.json();
    return NextResponse.json({
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      language: data.language,
      updatedAt: data.updated_at,
    });
  } catch {
    return NextResponse.json({ stars: null, forks: null });
  }
}
