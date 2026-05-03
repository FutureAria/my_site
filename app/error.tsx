"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-lg text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-red-400 mb-3">
          Runtime Error
        </p>
        <h1 className="text-2xl font-bold mb-3">페이지를 불러오는 중 문제가 발생했습니다.</h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          개발 서버에서 오류가 나면 이 화면이 먼저 보이도록 추가했습니다. 계속 반복되면
          아래 메시지를 확인해서 원인을 바로 찾을 수 있습니다.
        </p>
        <pre className="text-left text-xs text-red-300 bg-black/30 border border-white/10 rounded-xl p-4 overflow-auto mb-6 whitespace-pre-wrap break-words">
          {error.message}
        </pre>
        <button
          onClick={() => reset()}
          className="px-5 py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
