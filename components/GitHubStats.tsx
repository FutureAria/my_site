"use client";

import { useEffect, useState } from "react";

interface Stats {
  stars: number | null;
  forks: number | null;
  language: string | null;
}

function extractRepoPath(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("github.com")) return null;
    const parts = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return null;
  } catch {
    return null;
  }
}

export default function GitHubStats({ githubUrl }: { githubUrl: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const repo = extractRepoPath(githubUrl);

  useEffect(() => {
    if (!repo) return;
    fetch(`/api/github-stats?repo=${encodeURIComponent(repo)}`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [repo]);

  if (!repo || !stats || (stats.stars === null && stats.forks === null)) return null;

  return (
    <span className="flex items-center gap-2 text-xs text-gray-500">
      {stats.stars !== null && (
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {stats.stars}
        </span>
      )}
      {stats.forks !== null && (
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 5.74028 10.5978 6.38663 10 6.73244V7C10 7.55228 10.4477 8 11 8H13C14.6569 8 16 9.34315 16 11V11.2676C16.5978 11.6134 17 12.2597 17 13C17 14.1046 16.1046 15 15 15C13.8954 15 13 14.1046 13 13C13 12.2597 13.4022 11.6134 14 11.2676V11C14 10.4477 13.5523 10 13 10H11C10.3433 10 9.72685 9.80521 9.21045 9.47303C8.67816 9.83299 8 10.3767 8 11V11.2676C8.5978 11.6134 9 12.2597 9 13C9 14.1046 8.10457 15 7 15C5.89543 15 5 14.1046 5 13C5 12.2597 5.4022 11.6134 6 11.2676V6.73244C5.4022 6.38663 5 5.74028 5 5C5 3.89543 5.89543 3 7 3z" />
          </svg>
          {stats.forks}
        </span>
      )}
      {stats.language && <span className="text-gray-600">· {stats.language}</span>}
    </span>
  );
}
