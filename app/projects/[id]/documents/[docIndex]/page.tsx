import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface ProjectDocument {
  title?: string;
  description?: string;
  file?: string;
  preview?: string;
  type?: string;
}

interface Project {
  title: string;
  period: string;
  documents?: ProjectDocument[];
}

async function getData() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "portfolio.json"),
    "utf-8",
  );
  return JSON.parse(raw);
}

export async function generateStaticParams() {
  const data = await getData();
  return (data.projects || []).flatMap((project: Project, id: number) =>
    (project.documents || []).map((_: ProjectDocument, docIndex: number) => ({
      id: String(id),
      docIndex: String(docIndex),
    })),
  );
}

function isSafePublicPath(value?: string) {
  return Boolean(value && value.startsWith("/uploads/") && !value.includes(".."));
}

export default async function ProjectDocumentPage({
  params,
}: {
  params: Promise<{ id: string; docIndex: string }>;
}) {
  const { id, docIndex } = await params;
  const projectIndex = parseInt(id, 10);
  const documentIndex = parseInt(docIndex, 10);
  const data = await getData();
  const project: Project | undefined = data.projects[projectIndex];
  const document = project?.documents?.[documentIndex];

  if (!project || !document) notFound();

  const canPreview = isSafePublicPath(document.preview);
  const canDownload = isSafePublicPath(document.file);
  const downloadExt = (document.type || document.file?.split(".").pop() || "").toLowerCase();
  const downloadLabel =
    downloadExt === "pdf"
      ? "PDF 다운로드"
      : downloadExt === "pptx" || downloadExt === "ppt"
        ? "PPT 다운로드"
        : downloadExt === "xlsx" || downloadExt === "xls"
          ? "엑셀 다운로드"
          : "파일 다운로드";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href={`/projects/${projectIndex}`}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            프로젝트 상세
          </Link>
          <Link href="/" className="hidden sm:inline-block font-bold text-base gradient-text tracking-tight">
            JY.
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
              Project Document
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black leading-tight">
              {document.title || "프로젝트 문서"}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {project.title} · {project.period}
            </p>
          </div>
          {canDownload && (
            <a
              href={document.file}
              download
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-emerald-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 16.5V3" />
              </svg>
              {downloadLabel}
            </a>
          )}
        </div>

        {document.description && (
          <p className="readable-copy mb-6 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] text-left">
            {document.description}
          </p>
        )}

        {canPreview ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-hover)]">
            <iframe
              src={document.preview}
              title={`${project.title} 기획자료 미리보기`}
              className="h-[76vh] w-full bg-white"
            />
          </div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              이 문서는 사이트 미리보기가 없습니다. 다운로드 버튼으로 원본 파일을 확인할 수 있습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
