"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApiPath } from "@/lib/admin-api";
import type { JournalItem, PortfolioData, ProjectItem } from "@/lib/portfolio";

type AdminTab = "home" | "basic" | "featured" | "projects" | "journal" | "json";

const tabs: Array<{ id: AdminTab; label: string; desc: string; page: string; guide: string }> = [
  {
    id: "home",
    label: "홈 화면",
    desc: "첫 화면 문구와 이미지",
    page: "/",
    guide: "방문자가 처음 보는 큰 제목, 버튼, 노트, 오른쪽 이미지 콜라주를 관리합니다.",
  },
  {
    id: "basic",
    label: "기본정보",
    desc: "소개 문구와 연락처",
    page: "/contact",
    guide: "사이트 전반에 쓰이는 이름, 소개 문장, 이메일, GitHub, 연락 안내 문구를 관리합니다.",
  },
  {
    id: "featured",
    label: "대표",
    desc: "홈 대표 프로젝트",
    page: "/",
    guide: "홈 아래쪽에 노출할 대표 프로젝트 3개와 순서를 정합니다.",
  },
  {
    id: "projects",
    label: "프로젝트",
    desc: "포트폴리오 항목",
    page: "/projects",
    guide: "프로젝트 목록, 상세 페이지, 대표 이미지, 여러 장의 이미지 기록을 관리합니다.",
  },
  {
    id: "journal",
    label: "Journal",
    desc: "기록 글",
    page: "/journal",
    guide: "문제 상황, 해결 방법, 배운 점처럼 길게 남기는 글을 관리합니다.",
  },
  {
    id: "json",
    label: "JSON",
    desc: "전체 직접 편집",
    page: "/api/portfolio",
    guide: "전체 데이터를 한 번에 고칠 때만 사용합니다. 문법이 틀리면 저장 전 적용이 막힙니다.",
  },
];

const emptyProject: ProjectItem = {
  title: "새 프로젝트",
  period: "2026.00.00",
  desc: "프로젝트 설명을 입력하세요.",
  techs: ["React"],
  image: "",
  link: "",
  github: "",
  document: "",
  documentLabel: "PDF 설명서",
  detail: {
    role: "담당 역할을 입력하세요.",
    features: ["주요 기능을 입력하세요."],
    challenges: "문제와 해결 과정을 입력하세요.",
    takeaways: ["배운 점을 입력하세요."],
    images: [],
  },
};

const emptyJournal: JournalItem = {
  title: "새 기록",
  date: "2026-04-28",
  tags: ["기록"],
  summary: "짧은 요약을 입력하세요.",
  content: "본문을 입력하세요.",
};

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function AdminEditor({ initialData }: { initialData: PortfolioData }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<AdminTab>("home");
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedPost, setSelectedPost] = useState(0);
  const [rawJson, setRawJson] = useState(JSON.stringify(initialData, null, 2));
  const [message, setMessage] = useState("");
  const [draggedHomeImage, setDraggedHomeImage] = useState<number | null>(null);
  const [draggedProjectImage, setDraggedProjectImage] = useState<number | null>(null);

  const project = data.projects[selectedProject] || data.projects[0];
  const post = data.blog[selectedPost] || data.blog[0];
  const featuredIndexes = data.settings?.featuredProjectIndexes || [0, 1, 2];
  const home = data.settings?.home || {};
  const activeTabInfo = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const projectImagesText = useMemo(() => project?.detail?.images?.join("\n") || "", [project]);
  const projectFeaturesText = useMemo(() => project?.detail?.features?.join("\n") || "", [project]);
  const projectTakeawaysText = useMemo(() => project?.detail?.takeaways?.join("\n") || "", [project]);

  const updateData = (next: PortfolioData) => {
    setData(next);
    setRawJson(JSON.stringify(next, null, 2));
  };

  useEffect(() => {
    let cancelled = false;

    async function loadLatestData() {
      try {
        const response = await fetch(adminApiPath("portfolio"), { cache: "no-store" });
        if (!response.ok) return;
        const latest = (await response.json()) as PortfolioData;
        if (!cancelled) updateData(latest);
      } catch {
        // Keep the statically rendered data if the API is unavailable.
      }
    }

    loadLatestData();

    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    setMessage("저장 중...");
    const response = await fetch(adminApiPath("portfolio"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMessage(response.ok ? "저장 완료. 서버 데이터에 반영됐습니다." : "저장 실패.");
  };

  const applyRawJson = () => {
    try {
      updateData(JSON.parse(rawJson));
      setMessage("JSON 적용 완료. 저장 버튼을 눌러 파일에 반영하세요.");
    } catch {
      setMessage("JSON 형식이 올바르지 않습니다.");
    }
  };

  const updateProject = (patch: Partial<ProjectItem>) => {
    const projects = [...data.projects];
    projects[selectedProject] = { ...projects[selectedProject], ...patch };
    updateData({ ...data, projects });
  };

  const deleteProject = () => {
    if (!project || data.projects.length <= 1) {
      setMessage("프로젝트는 최소 1개 이상 있어야 합니다.");
      return;
    }

    if (!window.confirm(`"${project.title}" 프로젝트를 삭제할까요?`)) return;

    const projects = data.projects.filter((_, index) => index !== selectedProject);
    updateData({
      ...data,
      projects,
      settings: {
        ...data.settings,
        featuredProjectIndexes: [0, 1, 2].filter((index) => index < projects.length),
      },
    });
    setSelectedProject(Math.max(0, selectedProject - 1));
    setMessage("프로젝트를 삭제했습니다. 저장하기를 누르면 반영됩니다.");
  };

  const duplicateProject = () => {
    if (!project) return;
    const projects = [
      ...data.projects,
      {
        ...project,
        title: `${project.title} 복사본`,
        detail: {
          ...project.detail,
          features: [...(project.detail?.features || [])],
          takeaways: [...(project.detail?.takeaways || [])],
          images: [...(project.detail?.images || [])],
        },
        techs: [...project.techs],
      },
    ];
    updateData({ ...data, projects });
    setSelectedProject(projects.length - 1);
    setMessage("프로젝트를 복제했습니다. 제목과 내용을 수정한 뒤 저장하세요.");
  };

  const updateProjectDetail = (patch: NonNullable<ProjectItem["detail"]>) => {
    const projects = [...data.projects];
    projects[selectedProject] = {
      ...projects[selectedProject],
      detail: { ...projects[selectedProject].detail, ...patch },
    };
    updateData({ ...data, projects });
  };

  const moveProjectImage = (index: number, direction: -1 | 1) => {
    const images = project.detail?.images || [];
    updateProjectDetail({ images: moveItem(images, index, index + direction) });
  };

  const updateFeaturedIndexes = (value: string) => {
    const featuredProjectIndexes = value
      .split(",")
      .map((item) => Number(item.trim()) - 1)
      .filter((index) => Number.isInteger(index) && index >= 0 && index < data.projects.length)
      .slice(0, 3);

    updateData({
      ...data,
      settings: {
        ...data.settings,
        featuredProjectIndexes,
      },
    });
  };

  const updateHome = (patch: NonNullable<PortfolioData["settings"]>["home"]) => {
    updateData({
      ...data,
      settings: {
        ...data.settings,
        home: {
          ...data.settings?.home,
          ...patch,
        },
      },
    });
  };

  const updatePost = (patch: Partial<JournalItem>) => {
    const blog = [...data.blog];
    blog[selectedPost] = { ...blog[selectedPost], ...patch };
    updateData({ ...data, blog });
  };

  const deletePost = () => {
    if (!post || data.blog.length <= 1) {
      setMessage("Journal 기록은 최소 1개 이상 있어야 합니다.");
      return;
    }

    if (!window.confirm(`"${post.title}" 기록을 삭제할까요?`)) return;

    const blog = data.blog.filter((_, index) => index !== selectedPost);
    updateData({ ...data, blog });
    setSelectedPost(Math.max(0, selectedPost - 1));
    setMessage("Journal 기록을 삭제했습니다. 저장하기를 누르면 반영됩니다.");
  };

  const moveHomeImage = (index: number, direction: -1 | 1) => {
    updateHome({ collageImages: moveItem(home.collageImages || [], index, index + direction) });
  };

  const dropHomeImage = (to: number) => {
    if (draggedHomeImage === null) return;
    updateHome({ collageImages: moveItem(home.collageImages || [], draggedHomeImage, to) });
    setDraggedHomeImage(null);
  };

  const dropProjectImage = (to: number) => {
    if (draggedProjectImage === null) return;
    updateProjectDetail({ images: moveItem(project.detail?.images || [], draggedProjectImage, to) });
    setDraggedProjectImage(null);
  };

  const uploadImages = async (files: FileList | null, mode: "cover" | "detail" | "bundle") => {
    if (!files || files.length === 0 || !project) return;

    setMessage("이미지 업로드 중...");
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch(adminApiPath("upload"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(error?.message || "이미지 업로드 실패.");
      return;
    }

    const { paths } = (await response.json()) as { paths: string[] };

    if (mode === "cover") {
      updateProject({ image: paths[0] || project.image });
    } else if (mode === "detail") {
      updateProjectDetail({
        images: [...(project.detail?.images || []), ...paths],
      });
    } else {
      updateProject({
        image: paths[0] || project.image,
        detail: {
          ...project.detail,
          images: [...(project.detail?.images || []), ...paths],
        },
      });
    }

    setMessage(`${paths.length}장 업로드 완료. 저장하기를 누르면 프로젝트에 반영됩니다.`);
  };

  const uploadHomeImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setMessage("홈 이미지 업로드 중...");
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch(adminApiPath("upload"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(error?.message || "홈 이미지 업로드 실패.");
      return;
    }

    const { paths } = (await response.json()) as { paths: string[] };
    updateHome({ collageImages: [...(home.collageImages || []), ...paths] });
    setMessage(`홈 이미지 ${paths.length}장 업로드 완료. 저장하기를 누르면 반영됩니다.`);
  };

  const uploadPdfDocument = async (files: FileList | null, field: "resumeFile" | "coverLetterFile") => {
    if (!files || files.length === 0) return;

    const label = field === "resumeFile" ? "이력서" : "자기소개서";
    setMessage(`${label} 업로드 중...`);
    const formData = new FormData();
    formData.append("files", files[0]);

    const response = await fetch(adminApiPath("upload"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(error?.message || `${label} 업로드 실패.`);
      return;
    }

    const { paths } = (await response.json()) as { paths: string[] };
    updateData({ ...data, hero: { ...data.hero, [field]: paths[0] || data.hero[field] } });
    setMessage(`${label} 업로드 완료. 저장하기를 누르면 반영됩니다.`);
  };

  const uploadProjectDocument = async (files: FileList | null) => {
    if (!files || files.length === 0 || !project) return;

    setMessage("프로젝트 PDF 업로드 중...");
    const formData = new FormData();
    formData.append("files", files[0]);

    const response = await fetch(adminApiPath("upload"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(error?.message || "프로젝트 PDF 업로드 실패.");
      return;
    }

    const { paths } = (await response.json()) as { paths: string[] };
    updateProject({ document: paths[0] || project.document, documentLabel: project.documentLabel || "PDF 설명서" });
    setMessage("프로젝트 PDF 업로드 완료. 저장하기를 누르면 반영됩니다.");
  };

  const inputClass = "mt-2 w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none";
  const textareaClass = `${inputClass} min-h-28 leading-7`;
  const panelClass = "rounded-md border hairline p-5 sm:p-6";
  const helperClass = "mt-2 text-xs leading-6 ink-muted";

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-md border hairline p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`block w-full rounded-md px-4 py-3 text-left transition ${
                activeTab === tab.id ? "bg-[color:var(--text)] text-[color:var(--bg)]" : "hover:bg-[color:var(--bg-soft)]"
              }`}
            >
              <span className="block text-sm font-semibold">{tab.label}</span>
              <span className="mt-1 block text-xs opacity-70">{tab.desc}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-md border hairline p-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">EDIT GUIDE</p>
          <p className="mt-3 text-sm font-semibold">{activeTabInfo.label}</p>
          <p className="mt-2 text-xs leading-6 ink-muted">{activeTabInfo.guide}</p>
          <a href={activeTabInfo.page} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-semibold text-[color:var(--accent-strong)]">
            반영 화면 열기
          </a>
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <div className="sticky top-28 z-20 rounded-md border hairline bg-[color:var(--bg)]/88 p-4 backdrop-blur md:top-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">{activeTabInfo.label}</p>
              <p className="mt-1 text-xs ink-muted">{message || activeTabInfo.guide}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <a href={activeTabInfo.page} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border hairline px-4 text-sm font-semibold">
                화면 확인
              </a>
              <button onClick={save} className="h-10 rounded-md bg-[color:var(--text)] px-5 text-sm font-semibold text-[color:var(--bg)]">
                저장하기
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-md border hairline p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">LIVE PREVIEW</p>
          {activeTab === "home" && (
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="text-xs ink-muted">{home.eyebrow || "PORTFOLIO ARCHIVE"}</p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight">{home.headline || "기록하고, 만들고, 오래 남기는 사람"}</h2>
                <p className="mt-4 text-sm leading-7 ink-muted">{home.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(home.collageImages || []).slice(0, 3).map((src, index) => (
                  <img key={`${src}-preview-${index}`} src={src} alt="홈 미리보기" className="aspect-video rounded-md border hairline object-cover" />
                ))}
              </div>
            </div>
          )}
          {activeTab === "projects" && project && (
            <div className="mt-4 grid gap-4 lg:grid-cols-[12rem_1fr]">
              <div className="aspect-video overflow-hidden rounded-md border hairline bg-[color:var(--bg-soft)]">
                {project.image && <img src={project.image} alt="프로젝트 미리보기" className="h-full w-full object-cover" />}
              </div>
              <div>
                <p className="text-xs ink-muted">{project.period}</p>
                <h2 className="mt-2 text-2xl font-semibold">{project.title}</h2>
                <p className="mt-3 text-sm leading-7 ink-muted">{project.desc}</p>
              </div>
            </div>
          )}
          {activeTab === "journal" && post && (
            <div className="mt-4">
              <p className="text-xs ink-muted">{post.date}</p>
              <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 ink-muted">{post.summary}</p>
            </div>
          )}
          {activeTab !== "home" && activeTab !== "projects" && activeTab !== "journal" && (
            <p className="mt-4 text-sm leading-7 ink-muted">현재 탭에서 수정한 내용은 저장 후 해당 화면에서 확인할 수 있습니다.</p>
          )}
        </section>

        {activeTab === "home" && (
          <section className={panelClass}>
            <h2 className="text-xl font-semibold">홈 첫 화면</h2>
            <p className="mt-3 text-sm leading-7 ink-muted">
              메인 화면에 보이는 큰 문구, 버튼, 노트, 이미지 콜라주를 수정합니다.
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <label className="block text-sm">상단 라벨<input className={inputClass} value={home.eyebrow || ""} onChange={(event) => updateHome({ eyebrow: event.target.value })} /><span className={helperClass}>큰 제목 위에 작게 보이는 영문 라벨입니다.</span></label>
              <label className="block text-sm">큰 제목<input className={inputClass} value={home.headline || ""} onChange={(event) => updateHome({ headline: event.target.value })} /><span className={helperClass}>홈 첫 화면의 가장 큰 문장입니다. 너무 길면 자동 줄바꿈됩니다.</span></label>
              <label className="block text-sm lg:col-span-2">설명 문구<textarea className={textareaClass} value={home.description || ""} onChange={(event) => updateHome({ description: event.target.value })} /><span className={helperClass}>제목 아래에 보이는 짧은 소개입니다.</span></label>
              <label className="block text-sm">첫 번째 버튼<input className={inputClass} value={home.primaryCtaLabel || ""} onChange={(event) => updateHome({ primaryCtaLabel: event.target.value })} /><span className={helperClass}>프로젝트 목록으로 이동하는 버튼 문구입니다.</span></label>
              <label className="block text-sm">두 번째 버튼<input className={inputClass} value={home.secondaryCtaLabel || ""} onChange={(event) => updateHome({ secondaryCtaLabel: event.target.value })} /><span className={helperClass}>소개 페이지로 이동하는 버튼 문구입니다.</span></label>
              <label className="block text-sm">노트 라벨<input className={inputClass} value={home.noteLabel || ""} onChange={(event) => updateHome({ noteLabel: event.target.value })} /><span className={helperClass}>오른쪽 노트 박스의 작은 제목입니다.</span></label>
              <label className="block text-sm lg:col-span-2">노트 문구<textarea className={textareaClass} value={home.noteText || ""} onChange={(event) => updateHome({ noteText: event.target.value })} /><span className={helperClass}>오른쪽 아래 노트 박스에 들어가는 짧은 메시지입니다.</span></label>
              <div className="lg:col-span-2">
                <p className="text-sm">홈 이미지 콜라주</p>
                {(home.collageImages || []).length > 0 && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {home.collageImages?.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative cursor-grab"
                        draggable
                        onDragStart={() => setDraggedHomeImage(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => dropHomeImage(index)}
                      >
                        <img src={src} alt="홈 이미지 미리보기" className="aspect-video w-full rounded-md border hairline object-cover" />
                        <div className="absolute right-2 top-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveHomeImage(index, -1)}
                            className="rounded-md bg-[color:var(--text)] px-2 py-1 text-xs text-[color:var(--bg)]"
                          >
                            위
                          </button>
                          <button
                            type="button"
                            onClick={() => moveHomeImage(index, 1)}
                            className="rounded-md bg-[color:var(--text)] px-2 py-1 text-xs text-[color:var(--bg)]"
                          >
                            아래
                          </button>
                          <button
                            type="button"
                            onClick={() => updateHome({ collageImages: home.collageImages?.filter((_, itemIndex) => itemIndex !== index) })}
                            className="rounded-md bg-[color:var(--text)] px-2 py-1 text-xs text-[color:var(--bg)]"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  className={textareaClass}
                  value={(home.collageImages || []).join("\n")}
                  onChange={(event) => updateHome({ collageImages: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })}
                  placeholder="/uploads/example.png"
                />
                <p className="mt-3 text-xs leading-6 ink-muted">여러 장을 한 번에 선택할 수 있습니다. 이미지는 드래그하거나 위/아래 버튼으로 순서를 바꿀 수 있습니다.</p>
                <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold">
                  홈 이미지 여러 장 업로드
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => uploadHomeImages(event.target.files)} />
                </label>
              </div>
            </div>
          </section>
        )}

        {activeTab === "basic" && (
          <section className="grid gap-6 xl:grid-cols-2">
            <div className={panelClass}>
              <h2 className="text-xl font-semibold">메인 문구</h2>
              <label className="mt-5 block text-sm">
                배지
                <input className={inputClass} value={data.hero.badge} onChange={(event) => updateData({ ...data, hero: { ...data.hero, badge: event.target.value } })} />
                <span className={helperClass}>사이트에서 본인을 한 줄로 설명하는 짧은 라벨입니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                이름
                <input className={inputClass} value={data.hero.name} onChange={(event) => updateData({ ...data, hero: { ...data.hero, name: event.target.value } })} />
                <span className={helperClass}>브랜드 이름처럼 쓰이는 이름입니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                소개 문장
                <textarea className={textareaClass} value={data.hero.subtitle} onChange={(event) => updateData({ ...data, hero: { ...data.hero, subtitle: event.target.value } })} />
                <span className={helperClass}>소개 페이지나 메타 정보에 활용할 기본 소개 문장입니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                이력서 파일 경로
                <input className={inputClass} value={data.hero.resumeFile || ""} onChange={(event) => updateData({ ...data, hero: { ...data.hero, resumeFile: event.target.value } })} />
                <span className={helperClass}>예: /uploads/resume.pdf. 비워두면 이력서 버튼은 숨깁니다.</span>
              </label>
              <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold">
                이력서 PDF 업로드
                <input type="file" accept="application/pdf" className="sr-only" onChange={(event) => uploadPdfDocument(event.target.files, "resumeFile")} />
              </label>
              <label className="mt-5 block text-sm">
                자기소개서 파일 경로
                <input className={inputClass} value={data.hero.coverLetterFile || ""} onChange={(event) => updateData({ ...data, hero: { ...data.hero, coverLetterFile: event.target.value } })} />
                <span className={helperClass}>예: /uploads/cover-letter.pdf. 비워두면 자기소개서 버튼은 숨깁니다.</span>
              </label>
              <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold">
                자기소개서 PDF 업로드
                <input type="file" accept="application/pdf" className="sr-only" onChange={(event) => uploadPdfDocument(event.target.files, "coverLetterFile")} />
              </label>
            </div>

            <div className={panelClass}>
              <h2 className="text-xl font-semibold">연락처</h2>
              <label className="mt-5 block text-sm">
                이메일
                <input className={inputClass} value={data.contact.email} onChange={(event) => updateData({ ...data, contact: { ...data.contact, email: event.target.value } })} />
                <span className={helperClass}>Contact 페이지에 표시됩니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                GitHub
                <input className={inputClass} value={data.contact.github} onChange={(event) => updateData({ ...data, contact: { ...data.contact, github: event.target.value } })} />
                <span className={helperClass}>https://로 시작하는 전체 주소를 넣으면 좋습니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                홈페이지/Notion
                <input className={inputClass} value={data.contact.homepage} onChange={(event) => updateData({ ...data, contact: { ...data.contact, homepage: event.target.value } })} />
                <span className={helperClass}>Notion, 블로그, 개인 링크를 넣습니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                전화번호
                <input className={inputClass} value={data.contact.phone} onChange={(event) => updateData({ ...data, contact: { ...data.contact, phone: event.target.value } })} />
                <span className={helperClass}>공개하고 싶지 않으면 비워둬도 됩니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                지역
                <input className={inputClass} value={data.contact.address} onChange={(event) => updateData({ ...data, contact: { ...data.contact, address: event.target.value } })} />
                <span className={helperClass}>Contact 페이지에 표시되는 위치 정보입니다.</span>
              </label>
              <label className="mt-5 block text-sm">
                연락 문구
                <textarea className={textareaClass} value={data.contact.desc} onChange={(event) => updateData({ ...data, contact: { ...data.contact, desc: event.target.value } })} />
                <span className={helperClass}>연락 전에 보여줄 안내 문장입니다.</span>
              </label>
            </div>
          </section>
        )}

        {activeTab === "featured" && (
          <section className={panelClass}>
            <h2 className="text-xl font-semibold">홈 대표 프로젝트</h2>
            <p className="mt-3 text-sm leading-7 ink-muted">
              프로젝트 번호를 쉼표로 입력하세요. 최대 3개까지 홈에 표시됩니다.
            </p>
            <div className="mt-5 rounded-md border hairline p-4 text-sm leading-7 ink-muted">
              현재 선택: {featuredIndexes.map((index) => data.projects[index]?.title).filter(Boolean).join(" / ") || "없음"}
            </div>
            <label className="mt-5 block text-sm">
              대표 프로젝트 순서
              <input
                className={inputClass}
                value={featuredIndexes.map((index) => index + 1).join(", ")}
                onChange={(event) => updateFeaturedIndexes(event.target.value)}
                placeholder="예: 1, 3, 4"
              />
            </label>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {data.projects.map((item, index) => (
                <button
                  key={`${item.title}-featured-${index}`}
                  type="button"
                  onClick={() => {
                    const exists = featuredIndexes.includes(index);
                    const next = exists
                      ? featuredIndexes.filter((itemIndex) => itemIndex !== index)
                      : [...featuredIndexes, index].slice(0, 3);
                    updateData({ ...data, settings: { ...data.settings, featuredProjectIndexes: next } });
                  }}
                  className={`rounded-md border p-4 text-left transition ${
                    featuredIndexes.includes(index)
                      ? "border-[color:var(--accent)] bg-[color:var(--bg-soft)]"
                      : "hairline hover:bg-[color:var(--bg-soft)]"
                  }`}
                >
                  <span className="text-xs ink-muted">{index + 1}</span>
                  <span className="mt-2 block text-sm font-semibold">{item.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "projects" && (
          <section className={panelClass}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">프로젝트 수정/추가</h2>
                <p className="mt-2 text-sm leading-7 ink-muted">프로젝트를 추가하거나 삭제하고, 상세 이미지 순서를 정리합니다.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    updateData({ ...data, projects: [...data.projects, emptyProject] });
                    setSelectedProject(data.projects.length);
                  }}
                  className="h-10 rounded-md border hairline px-4 text-sm font-semibold"
                >
                  프로젝트 추가
                </button>
                <button
                  onClick={deleteProject}
                  className="h-10 rounded-md border border-red-500/40 px-4 text-sm font-semibold text-red-500"
                >
                  삭제
                </button>
                <button
                  onClick={duplicateProject}
                  className="h-10 rounded-md border hairline px-4 text-sm font-semibold"
                >
                  복제
                </button>
              </div>
            </div>
            <select className={inputClass} value={selectedProject} onChange={(event) => setSelectedProject(Number(event.target.value))}>
              {data.projects.map((item, index) => (
                <option key={`${item.title}-${index}`} value={index}>
                  {index + 1}. {item.title}
                </option>
              ))}
            </select>
            {project && (
              <div className="mt-4 rounded-md border hairline p-4 text-sm leading-7 ink-muted">
                현재 편집 중: <span className="font-semibold text-[color:var(--text)]">{project.title}</span> · 기술 {project.techs.length}개 · 상세 이미지 {project.detail?.images?.length || 0}장
              </div>
            )}
            {project && (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="lg:col-span-2 border-t hairline pt-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">01 BASIC</p>
                  <p className="mt-2 text-sm ink-muted">목록과 상세 페이지에 공통으로 보이는 기본 정보입니다.</p>
                </div>
                <label className="block text-sm">제목<input className={inputClass} value={project.title} onChange={(event) => updateProject({ title: event.target.value })} /><span className={helperClass}>프로젝트 카드와 상세 페이지 제목에 표시됩니다.</span></label>
                <label className="block text-sm">기간<input className={inputClass} value={project.period} onChange={(event) => updateProject({ period: event.target.value })} /><span className={helperClass}>예: 2026.01.02 ~ 01.07 또는 진행 중</span></label>
                <label className="block text-sm lg:col-span-2">한 줄 설명<textarea className={textareaClass} value={project.desc} onChange={(event) => updateProject({ desc: event.target.value })} /><span className={helperClass}>프로젝트 목록 카드에 먼저 보이는 요약입니다.</span></label>
                <label className="block text-sm lg:col-span-2">기술 스택, 쉼표로 구분<input className={inputClass} value={project.techs.join(", ")} onChange={(event) => updateProject({ techs: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /><span className={helperClass}>예: React, MySQL, REST API</span></label>
                <div className="lg:col-span-2 border-t hairline pt-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">02 IMAGES</p>
                  <p className="mt-2 text-sm ink-muted">대표 이미지와 상세 이미지 기록입니다. 이미지는 업로드 시 WebP로 압축됩니다.</p>
                </div>
                <div className="block text-sm">
                  대표 이미지
                  {project.image && (
                    <img
                      src={project.image}
                      alt="대표 이미지 미리보기"
                      className="mt-2 aspect-video w-full rounded-md border hairline object-cover"
                    />
                  )}
                  <input className={inputClass} value={project.image} onChange={(event) => updateProject({ image: event.target.value })} />
                  <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold">
                    대표 이미지 업로드
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => uploadImages(event.target.files, "cover")}
                    />
                  </label>
                  <label className="ml-0 mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold sm:ml-2">
                    이미지 묶음 업로드
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) => uploadImages(event.target.files, "bundle")}
                    />
                  </label>
                  <p className="mt-2 text-xs leading-6 ink-muted">여러 장 선택 시 첫 장은 대표 이미지, 전체는 상세 이미지 기록에 추가됩니다.</p>
                </div>
                <div className="lg:col-span-2 border-t hairline pt-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">03 LINKS</p>
                  <p className="mt-2 text-sm ink-muted">방문자가 직접 눌러볼 수 있는 서버, 코드, PDF 설명서입니다.</p>
                </div>
                <label className="block text-sm">서버/Demo 주소<input className={inputClass} value={project.link} onChange={(event) => updateProject({ link: event.target.value })} /><span className={helperClass}>배포된 서버, 시연 페이지, 서비스 주소를 넣습니다. 없으면 비워두면 됩니다.</span></label>
                <label className="block text-sm">GitHub 주소<input className={inputClass} value={project.github} onChange={(event) => updateProject({ github: event.target.value })} /><span className={helperClass}>코드를 볼 수 있는 GitHub 저장소 주소입니다. 없으면 비워두면 됩니다.</span></label>
                <div className="block text-sm lg:col-span-2">
                  프로젝트 PDF 설명서
                  <div className="mt-2 grid gap-3 lg:grid-cols-[1fr_14rem]">
                    <input
                      className="w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none"
                      value={project.document || ""}
                      onChange={(event) => updateProject({ document: event.target.value })}
                      placeholder="/uploads/project-guide.pdf"
                    />
                    <input
                      className="w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none"
                      value={project.documentLabel || ""}
                      onChange={(event) => updateProject({ documentLabel: event.target.value })}
                      placeholder="PDF 설명서"
                    />
                  </div>
                  <span className={helperClass}>프로젝트가 어떤 서비스인지 간략히 설명하는 PDF를 넣습니다. 가능하면 5MB 이하로 가볍게 올리는 게 좋습니다.</span>
                  <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold">
                    프로젝트 PDF 업로드
                    <input type="file" accept="application/pdf" className="sr-only" onChange={(event) => uploadProjectDocument(event.target.files)} />
                  </label>
                </div>
                <div className="lg:col-span-2 border-t hairline pt-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--accent-strong)]">04 DETAIL</p>
                  <p className="mt-2 text-sm ink-muted">채용 담당자가 읽을 역할, 기능, 문제 해결, 배운 점입니다.</p>
                </div>
                <label className="block text-sm lg:col-span-2">역할<textarea className={textareaClass} value={project.detail?.role || ""} onChange={(event) => updateProjectDetail({ role: event.target.value })} /><span className={helperClass}>본인이 맡은 설계, 구현, 개선 내용을 적습니다.</span></label>
                <label className="block text-sm">주요 기능, 줄바꿈으로 구분<textarea className={textareaClass} value={projectFeaturesText} onChange={(event) => updateProjectDetail({ features: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} /><span className={helperClass}>한 줄에 하나씩 쓰면 상세 페이지에서 구분되어 보입니다.</span></label>
                <label className="block text-sm">배운 점, 줄바꿈으로 구분<textarea className={textareaClass} value={projectTakeawaysText} onChange={(event) => updateProjectDetail({ takeaways: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} /><span className={helperClass}>상세 페이지의 배운 점 영역에 표시됩니다.</span></label>
                <div className="block text-sm">
                  상세 이미지 기록
                  {(project.detail?.images || []).length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {project.detail?.images?.map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="relative cursor-grab"
                          draggable
                          onDragStart={() => setDraggedProjectImage(index)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => dropProjectImage(index)}
                        >
                          <img
                            src={src}
                            alt="상세 이미지 미리보기"
                            className="aspect-video w-full rounded-md border hairline object-cover"
                          />
                          <div className="absolute right-2 top-2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveProjectImage(index, -1)}
                              className="rounded-md bg-[color:var(--text)] px-2 py-1 text-xs text-[color:var(--bg)]"
                            >
                              위
                            </button>
                            <button
                              type="button"
                              onClick={() => moveProjectImage(index, 1)}
                              className="rounded-md bg-[color:var(--text)] px-2 py-1 text-xs text-[color:var(--bg)]"
                            >
                              아래
                            </button>
                            <button
                              type="button"
                              onClick={() => updateProjectDetail({ images: project.detail?.images?.filter((_, itemIndex) => itemIndex !== index) || [] })}
                              className="rounded-md bg-[color:var(--text)] px-2 py-1 text-xs text-[color:var(--bg)]"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea className={textareaClass} value={projectImagesText} onChange={(event) => updateProjectDetail({ images: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} />
                  <p className="mt-2 text-xs leading-6 ink-muted">이미지는 드래그하거나 위/아래 버튼으로 순서를 바꿀 수 있습니다.</p>
                  <label className="mt-3 inline-flex h-10 cursor-pointer items-center rounded-md border hairline px-4 text-sm font-semibold">
                    상세 이미지 여러 장 업로드
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) => uploadImages(event.target.files, "detail")}
                    />
                  </label>
                </div>
                <label className="block text-sm lg:col-span-2">문제와 해결<textarea className={textareaClass} value={project.detail?.challenges || ""} onChange={(event) => updateProjectDetail({ challenges: event.target.value })} /><span className={helperClass}>채용 담당자가 가장 오래 보는 부분입니다. 문제, 원인, 해결, 배운 점 순서로 쓰면 좋습니다.</span></label>
              </div>
            )}
          </section>
        )}

        {activeTab === "journal" && (
          <section className={panelClass}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Journal 수정/추가</h2>
                <p className="mt-2 text-sm leading-7 ink-muted">문제 해결 과정, 회고, 학습 기록을 추가하거나 삭제합니다.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    updateData({ ...data, blog: [...data.blog, emptyJournal] });
                    setSelectedPost(data.blog.length);
                  }}
                  className="h-10 rounded-md border hairline px-4 text-sm font-semibold"
                >
                  기록 추가
                </button>
                <button
                  onClick={deletePost}
                  className="h-10 rounded-md border border-red-500/40 px-4 text-sm font-semibold text-red-500"
                >
                  삭제
                </button>
              </div>
            </div>
            <select className={inputClass} value={selectedPost} onChange={(event) => setSelectedPost(Number(event.target.value))}>
              {data.blog.map((item, index) => (
                <option key={`${item.title}-${index}`} value={index}>
                  {index + 1}. {item.title}
                </option>
              ))}
            </select>
            {post && (
              <div className="mt-4 rounded-md border hairline p-4 text-sm leading-7 ink-muted">
                현재 편집 중: <span className="font-semibold text-[color:var(--text)]">{post.title}</span> · 태그 {post.tags.length}개
              </div>
            )}
            {post && (
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <label className="block text-sm">제목<input className={inputClass} value={post.title} onChange={(event) => updatePost({ title: event.target.value })} /><span className={helperClass}>Journal 목록에 보이는 제목입니다.</span></label>
                <label className="block text-sm">날짜<input className={inputClass} value={post.date} onChange={(event) => updatePost({ date: event.target.value })} /><span className={helperClass}>예: 2026-04-28</span></label>
                <label className="block text-sm lg:col-span-2">태그, 쉼표로 구분<input className={inputClass} value={post.tags.join(", ")} onChange={(event) => updatePost({ tags: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /><span className={helperClass}>예: MySQL, 트랜잭션, 백엔드</span></label>
                <label className="block text-sm lg:col-span-2">요약<textarea className={textareaClass} value={post.summary} onChange={(event) => updatePost({ summary: event.target.value })} /><span className={helperClass}>접힌 상태에서도 보이는 짧은 설명입니다.</span></label>
                <label className="block text-sm lg:col-span-2">본문<textarea className={`${textareaClass} min-h-72`} value={post.content} onChange={(event) => updatePost({ content: event.target.value })} /><span className={helperClass}>길어도 괜찮습니다. Journal 화면에서는 접었다 펼치는 방식으로 보입니다.</span></label>
              </div>
            )}
          </section>
        )}

        {activeTab === "json" && (
          <section className={panelClass}>
            <h2 className="text-xl font-semibold">전체 JSON 직접 편집</h2>
            <p className="mt-3 text-sm ink-muted">세부 구조를 한 번에 바꾸고 싶을 때만 사용하세요.</p>
            <textarea className={`${textareaClass} mt-5 min-h-96 font-mono text-xs`} value={rawJson} onChange={(event) => setRawJson(event.target.value)} />
            <button onClick={applyRawJson} className="mt-4 h-10 rounded-md border hairline px-4 text-sm font-semibold">
              JSON 적용
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
