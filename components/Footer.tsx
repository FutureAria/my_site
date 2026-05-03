import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t hairline px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>기록하고, 만들고, 오래 남기는 사람.</p>
        <div className="flex gap-5">
          <Link href="/projects" className="hover:text-[color:var(--text)]">Projects</Link>
          <Link href="/about" className="hover:text-[color:var(--text)]">About</Link>
          <Link href="/contact" className="hover:text-[color:var(--text)]">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
