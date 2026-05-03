export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} <span className="gradient-text font-semibold">박주영</span>. 모든 권리 보유.
        </p>
        <p className="text-xs text-gray-600">
          Next.js와 Tailwind CSS로 제작했습니다.
        </p>
      </div>
    </footer>
  );
}
