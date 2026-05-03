export default function Loading() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[color:var(--accent-strong)]">LOADING</p>
        <div className="mt-6 space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded-md bg-[color:var(--bg-soft)]" />
          <div className="h-8 w-1/2 animate-pulse rounded-md bg-[color:var(--bg-soft)]" />
          <div className="mt-8 h-40 animate-pulse rounded-md border hairline bg-[color:var(--bg-soft)]" />
        </div>
      </div>
    </div>
  );
}
