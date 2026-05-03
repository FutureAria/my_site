"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", nextDark);
    setDark(nextDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b hairline bg-[color:var(--bg)]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-base font-semibold">박주영</span>
          <span className="hidden text-xs ink-muted sm:inline">Portfolio Archive</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm ink-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[color:var(--text)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border hairline transition hover:bg-[color:var(--bg-soft)]"
          aria-label="테마 변경"
          title="테마 변경"
        >
          <span className="text-sm">{dark ? "☾" : "☼"}</span>
        </button>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-5 overflow-x-auto border-t hairline px-4 py-2.5 text-sm ink-muted md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 transition hover:text-[color:var(--text)]">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
