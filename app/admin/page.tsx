"use client";

import { useEffect, useState, useRef } from "react";

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  type: string;
  image: string;
  subjects: string[];
}

interface ProjectDetail {
  role: string;
  features: string[];
  challenges: string;
  images: string[];
}

interface Project {
  title: string;
  period: string;
  desc: string;
  techs: string[];
  image: string;
  link: string;
  github: string;
  detail: ProjectDetail;
}

interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

interface PortfolioData {
  hero: { badge: string; name: string; subtitle: string; resumeFile: string };
  about: { intro: string; timeline: TimelineItem[] };
  projects: Project[];
  blog: BlogPost[];
  skills: Record<string, string[]>;
  contact: {
    desc: string;
    email: string;
    phone: string;
    address: string;
    homepage: string;
    github: string;
    extraItems?: {
      label: string;
      value: string;
      href: string;
    }[];
  };
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export default function AdminPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [openProjects, setOpenProjects] = useState<Set<number>>(new Set([0]));
  const [openAbout, setOpenAbout] = useState<Set<number>>(new Set([0]));
  const [openBlog, setOpenBlog] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
      fetch("/api/portfolio")
        .then((r) => r.json())
        .then(setData);
    }
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setAuthed(true);
      sessionStorage.setItem("admin_authed", "true");
      fetch("/api/portfolio")
        .then((r) => r.json())
        .then(setData);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="glass rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-white mb-2 text-center">
            관리자 로그인
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            비밀번호를 입력하세요
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="비밀번호"
            className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 mb-4"
            autoFocus
          />
          {pwError && (
            <p className="text-red-400 text-xs mb-3 text-center">
              비밀번호가 올바르지 않습니다
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg shadow-blue-500/20"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  const save = async () => {
    if (!data) return;
    setSaving(true);
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const tabs = [
    { id: "hero", label: "히어로" },
    { id: "about", label: "소개" },
    { id: "projects", label: "프로젝트" },
    { id: "blog", label: "블로그" },
    { id: "skills", label: "기술 스택" },
    { id: "contact", label: "연락처" },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← 사이트로 돌아가기
            </a>
            <span className="text-gray-700">|</span>
            <h1 className="font-bold text-lg gradient-text">관리자 페이지</h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {saving ? "저장 중..." : saved ? "저장 완료!" : "저장하기"}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hero section */}
        {activeTab === "hero" && (
          <Section title="히어로 섹션">
            <Field
              label="배지 텍스트"
              value={data.hero.badge}
              onChange={(v) =>
                setData({ ...data, hero: { ...data.hero, badge: v } })
              }
            />
            <Field
              label="이름"
              value={data.hero.name}
              onChange={(v) =>
                setData({ ...data, hero: { ...data.hero, name: v } })
              }
            />
            <TextArea
              label="소개 문구"
              value={data.hero.subtitle}
              onChange={(v) =>
                setData({ ...data, hero: { ...data.hero, subtitle: v } })
              }
            />
            {/* Resume upload */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 font-medium mb-1.5">
                이력서 PDF
              </label>
              {data.hero.resumeFile ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-emerald-400">
                    업로드 완료: {data.hero.resumeFile.split("/").pop()}
                  </span>
                  <button
                    onClick={() =>
                      setData({
                        ...data,
                        hero: { ...data.hero, resumeFile: "" },
                      })
                    }
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <FileUpload
                  accept=".pdf"
                  label="PDF 파일 업로드"
                  onUploaded={(url) =>
                    setData({
                      ...data,
                      hero: { ...data.hero, resumeFile: url },
                    })
                  }
                />
              )}
            </div>
          </Section>
        )}

        {/* About section */}
        {activeTab === "about" && (
          <Section title="소개 섹션">
            <TextArea
              label="자기소개"
              value={data.about.intro}
              onChange={(v) =>
                setData({ ...data, about: { ...data.about, intro: v } })
              }
              rows={5}
            />
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">학력/경력</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenAbout(new Set(data.about.timeline.map((_, i) => i)))}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
                  >
                    모두 펼치기
                  </button>
                  <span className="text-gray-700">|</span>
                  <button
                    onClick={() => setOpenAbout(new Set())}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
                  >
                    모두 접기
                  </button>
                </div>
              </div>
              {data.about.timeline.map((item, i) => {
                const isOpen = openAbout.has(i);
                const toggleOpen = () => {
                  const next = new Set(openAbout);
                  if (next.has(i)) next.delete(i);
                  else next.add(i);
                  setOpenAbout(next);
                };
                return (
                <div key={i} className="glass rounded-xl mb-4 overflow-hidden">
                  {/* Header - always visible */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                    onClick={toggleOpen}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      <span className="text-white font-semibold">
                        {item.title || `항목 ${i + 1}`}
                      </span>
                      {item.year && (
                        <span className="text-xs text-gray-500">{item.year}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <MoveButton
                        direction="up"
                        disabled={i === 0}
                        onClick={() =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              timeline: swap(data.about.timeline, i, i - 1),
                            },
                          })
                        }
                      />
                      <MoveButton
                        direction="down"
                        disabled={i === data.about.timeline.length - 1}
                        onClick={() =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              timeline: swap(data.about.timeline, i, i + 1),
                            },
                          })
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              timeline: data.about.timeline.filter(
                                (_, idx) => idx !== i
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  {!isOpen ? null : <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="기간"
                      value={item.year}
                      onChange={(v) => {
                        const timeline = [...data.about.timeline];
                        timeline[i] = { ...timeline[i], year: v };
                        setData({
                          ...data,
                          about: { ...data.about, timeline },
                        });
                      }}
                    />
                    <Field
                      label="제목"
                      value={item.title}
                      onChange={(v) => {
                        const timeline = [...data.about.timeline];
                        timeline[i] = { ...timeline[i], title: v };
                        setData({
                          ...data,
                          about: { ...data.about, timeline },
                        });
                      }}
                    />
                  </div>
                  <TextArea
                    label="설명"
                    value={item.desc}
                    onChange={(v) => {
                      const timeline = [...data.about.timeline];
                      timeline[i] = { ...timeline[i], desc: v };
                      setData({
                        ...data,
                        about: { ...data.about, timeline },
                      });
                    }}
                    rows={4}
                  />
                  <div className="flex items-center gap-4 mt-2">
                    <label className="text-xs text-gray-500">유형:</label>
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const timeline = [...data.about.timeline];
                        timeline[i] = { ...timeline[i], type: e.target.value };
                        setData({
                          ...data,
                          about: { ...data.about, timeline },
                        });
                      }}
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
                    >
                      <option value="education">학력</option>
                      <option value="training">교육</option>
                      <option value="career">경력</option>
                      <option value="award">수상 경력</option>
                      <option value="certificate">자격증</option>
                    </select>
                  </div>
                  {/* Logo image */}
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">
                      로고 이미지
                    </label>
                    {item.image ? (
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        <button
                          onClick={() => {
                            const timeline = [...data.about.timeline];
                            timeline[i] = { ...timeline[i], image: "" };
                            setData({ ...data, about: { ...data.about, timeline } });
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <FileUpload
                        accept="image/*"
                        label="로고 업로드"
                        onUploaded={(url) => {
                          const timeline = [...data.about.timeline];
                          timeline[i] = { ...timeline[i], image: url };
                          setData({ ...data, about: { ...data.about, timeline } });
                        }}
                      />
                    )}
                  </div>
                  {/* Subjects */}
                  <DelimitedField
                    label="주요 과목 (쉼표로 구분)"
                    values={item.subjects || []}
                    placeholder="예: 자료구조, 운영체제, 데이터베이스"
                    onCommit={(subjects) => {
                      const timeline = [...data.about.timeline];
                      timeline[i] = {
                        ...timeline[i],
                        subjects,
                      };
                      setData({ ...data, about: { ...data.about, timeline } });
                    }}
                  />
                  </div>}
                </div>
                );
              })}
              <button
                onClick={() => {
                  const newIdx = data.about.timeline.length;
                  setData({
                    ...data,
                    about: {
                      ...data.about,
                      timeline: [
                        ...data.about.timeline,
                        { year: "", title: "", desc: "", type: "education", image: "", subjects: [] },
                      ],
                    },
                  });
                  setOpenAbout(new Set([...openAbout, newIdx]));
                }}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                + 항목 추가
              </button>
            </div>
          </Section>
        )}

        {/* Projects section */}
        {activeTab === "projects" && (
          <Section title="프로젝트">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setOpenProjects(new Set(data.projects.map((_, i) => i)))}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                모두 펼치기
              </button>
              <span className="text-gray-700">|</span>
              <button
                onClick={() => setOpenProjects(new Set())}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                모두 접기
              </button>
            </div>
            {data.projects.map((project, i) => {
              const isOpen = openProjects.has(i);
              const toggleOpen = () => {
                const next = new Set(openProjects);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                setOpenProjects(next);
              };
              return (
              <div key={i} className="glass rounded-xl mb-4 overflow-hidden">
                {/* Header with move/delete - always visible */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                  onClick={toggleOpen}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <h3 className="text-white font-semibold">
                      {project.title || `프로젝트 ${i + 1}`}
                    </h3>
                    {project.period && (
                      <span className="text-xs text-gray-500">{project.period}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <MoveButton
                      direction="up"
                      disabled={i === 0}
                      onClick={() =>
                        setData({
                          ...data,
                          projects: swap(data.projects, i, i - 1),
                        })
                      }
                    />
                    <MoveButton
                      direction="down"
                      disabled={i === data.projects.length - 1}
                      onClick={() =>
                        setData({
                          ...data,
                          projects: swap(data.projects, i, i + 1),
                        })
                      }
                    />
                    <DeleteButton
                      onClick={() =>
                        setData({
                          ...data,
                          projects: data.projects.filter(
                            (_, idx) => idx !== i
                          ),
                        })
                      }
                    />
                  </div>
                </div>

                {!isOpen ? null : <div className="px-5 pb-5 border-t border-white/5 pt-4">

                {/* Image upload */}
                <ImageUpload
                  image={project.image}
                  onChange={(url) => {
                    const projects = [...data.projects];
                    projects[i] = { ...projects[i], image: url };
                    setData({ ...data, projects });
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="프로젝트명"
                    value={project.title}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[i] = { ...projects[i], title: v };
                      setData({ ...data, projects });
                    }}
                  />
                  <Field
                    label="기간"
                    value={project.period}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[i] = { ...projects[i], period: v };
                      setData({ ...data, projects });
                    }}
                  />
                </div>
                <TextArea
                  label="설명"
                  value={project.desc}
                  onChange={(v) => {
                    const projects = [...data.projects];
                    projects[i] = { ...projects[i], desc: v };
                    setData({ ...data, projects });
                  }}
                />
                <DelimitedField
                  label="기술 스택 (쉼표로 구분)"
                  values={project.techs}
                  onCommit={(techs) => {
                    const projects = [...data.projects];
                    projects[i] = {
                      ...projects[i],
                      techs,
                    };
                    setData({ ...data, projects });
                  }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="데모/사이트 링크 (없으면 비워두세요)"
                    value={project.link}
                    placeholder="https://..."
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[i] = { ...projects[i], link: v };
                      setData({ ...data, projects });
                    }}
                  />
                  <Field
                    label="GitHub 링크 (없으면 비워두세요)"
                    value={project.github}
                    placeholder="https://github.com/..."
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[i] = { ...projects[i], github: v };
                      setData({ ...data, projects });
                    }}
                  />
                </div>

                {/* Detail section */}
                <details className="mt-4">
                  <summary className="text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition-colors mb-3">
                    상세 정보 (프로젝트 상세 페이지용)
                  </summary>
                  <div className="pl-2 border-l-2 border-blue-500/20 ml-1 mt-3">
                    <Field
                      label="담당 역할"
                      value={project.detail?.role || ""}
                      placeholder="예: 백엔드 개발 및 DB 설계 담당"
                      onChange={(v) => {
                        const projects = [...data.projects];
                        projects[i] = {
                          ...projects[i],
                          detail: { ...projects[i].detail, role: v },
                        };
                        setData({ ...data, projects });
                      }}
                    />
                    <DelimitedField
                      label="주요 기능 (쉼표로 구분)"
                      values={project.detail?.features || []}
                      placeholder="예: 위치 기반 추천, 실시간 채팅, 데이터 시각화"
                      onCommit={(features) => {
                        const projects = [...data.projects];
                        projects[i] = {
                          ...projects[i],
                          detail: {
                            ...projects[i].detail,
                            features,
                          },
                        };
                        setData({ ...data, projects });
                      }}
                    />
                    <TextArea
                      label="문제 해결 / 트러블슈팅"
                      value={project.detail?.challenges || ""}
                      onChange={(v) => {
                        const projects = [...data.projects];
                        projects[i] = {
                          ...projects[i],
                          detail: { ...projects[i].detail, challenges: v },
                        };
                        setData({ ...data, projects });
                      }}
                      rows={4}
                    />
                    {/* Detail images */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-400 font-medium mb-1.5">
                        스크린샷 (여러 장)
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {(project.detail?.images || []).map((img, j) => (
                          <div
                            key={j}
                            className="relative group rounded-lg overflow-hidden border border-white/10"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-20 object-cover"
                            />
                            <button
                              onClick={() => {
                                const projects = [...data.projects];
                                const images = [
                                  ...(projects[i].detail?.images || []),
                                ];
                                images.splice(j, 1);
                                projects[i] = {
                                  ...projects[i],
                                  detail: { ...projects[i].detail, images },
                                };
                                setData({ ...data, projects });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded bg-red-500/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <FileUpload
                        accept="image/*"
                        label="스크린샷 추가"
                        onUploaded={(url) => {
                          const projects = [...data.projects];
                          const images = [
                            ...(projects[i].detail?.images || []),
                            url,
                          ];
                          projects[i] = {
                            ...projects[i],
                            detail: { ...projects[i].detail, images },
                          };
                          setData({ ...data, projects });
                        }}
                      />
                    </div>
                  </div>
                </details>
                </div>}
              </div>
              );
            })}
            <button
              onClick={() => {
                const newIdx = data.projects.length;
                setData({
                  ...data,
                  projects: [
                    ...data.projects,
                    {
                      title: "",
                      period: "",
                      desc: "",
                      techs: [],
                      image: "",
                      link: "",
                      github: "",
                      detail: {
                        role: "",
                        features: [],
                        challenges: "",
                        images: [],
                      },
                    },
                  ],
                });
                setOpenProjects(new Set([...openProjects, newIdx]));
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + 프로젝트 추가
            </button>
          </Section>
        )}

        {/* Blog section */}
        {activeTab === "blog" && (
          <Section title="블로그">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  메인 블로그 카드와 상세 글 페이지에 함께 반영됩니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenBlog(new Set((data.blog || []).map((_, i) => i)))}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
                >
                  모두 펼치기
                </button>
                <span className="text-gray-700">|</span>
                <button
                  onClick={() => setOpenBlog(new Set())}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
                >
                  모두 접기
                </button>
              </div>
            </div>

            {(data.blog || []).map((post, i) => {
              const isOpen = openBlog.has(i);
              const toggleOpen = () => {
                const next = new Set(openBlog);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                setOpenBlog(next);
              };

              return (
                <div key={i} className="glass rounded-xl mb-4 overflow-hidden">
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                    onClick={toggleOpen}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <svg
                        className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      <div className="min-w-0">
                        <h3 className="truncate text-white font-semibold">
                          {post.title || `블로그 글 ${i + 1}`}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {post.date && <span>{post.date}</span>}
                          {(post.tags || []).slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-md bg-blue-500/10 px-2 py-0.5 text-blue-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`/blog/${i}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        보기
                      </a>
                      <MoveButton
                        direction="up"
                        disabled={i === 0}
                        onClick={() =>
                          setData({
                            ...data,
                            blog: swap(data.blog || [], i, i - 1),
                          })
                        }
                      />
                      <MoveButton
                        direction="down"
                        disabled={i === (data.blog || []).length - 1}
                        onClick={() =>
                          setData({
                            ...data,
                            blog: swap(data.blog || [], i, i + 1),
                          })
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          setData({
                            ...data,
                            blog: (data.blog || []).filter((_, idx) => idx !== i),
                          })
                        }
                      />
                    </div>
                  </div>

                  {!isOpen ? null : (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                          label="제목"
                          value={post.title}
                          placeholder="예: 트랜잭션으로 동시성 문제 해결하기"
                          onChange={(v) => {
                            const blog = [...(data.blog || [])];
                            blog[i] = { ...blog[i], title: v };
                            setData({ ...data, blog });
                          }}
                        />
                        <Field
                          label="날짜"
                          value={post.date}
                          placeholder="2026-05-04"
                          onChange={(v) => {
                            const blog = [...(data.blog || [])];
                            blog[i] = { ...blog[i], date: v };
                            setData({ ...data, blog });
                          }}
                        />
                      </div>
                      <DelimitedField
                        label="태그 (쉼표로 구분)"
                        values={post.tags || []}
                        placeholder="예: MySQL, 백엔드, 트러블슈팅"
                        onCommit={(tags) => {
                          const blog = [...(data.blog || [])];
                          blog[i] = { ...blog[i], tags };
                          setData({ ...data, blog });
                        }}
                      />
                      <TextArea
                        label="카드 요약"
                        value={post.summary}
                        onChange={(v) => {
                          const blog = [...(data.blog || [])];
                          blog[i] = { ...blog[i], summary: v };
                          setData({ ...data, blog });
                        }}
                        rows={3}
                      />
                      <TextArea
                        label="본문 (Markdown)"
                        value={post.content}
                        onChange={(v) => {
                          const blog = [...(data.blog || [])];
                          blog[i] = { ...blog[i], content: v };
                          setData({ ...data, blog });
                        }}
                        rows={12}
                      />
                      <p className="text-xs text-gray-500">
                        `## 제목`, `- 목록`, ```코드블록``` 형태를 사용할 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => {
                const blog = data.blog || [];
                const newIdx = blog.length;
                setData({
                  ...data,
                  blog: [
                    ...blog,
                    {
                      title: "",
                      date: new Date().toISOString().slice(0, 10),
                      tags: [],
                      summary: "",
                      content: "## 기록 제목\n\n여기에 배운 점과 해결 과정을 적어주세요.",
                    },
                  ],
                });
                setOpenBlog(new Set([...openBlog, newIdx]));
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + 블로그 글 추가
            </button>
          </Section>
        )}

        {/* Skills section */}
        {activeTab === "skills" && (
          <Section title="기술 스택">
            {Object.entries(data.skills).map(([category, skills], index) => (
              <div key={index} className="glass rounded-xl p-5 mb-4">
                <Field
                  label="카테고리명"
                  value={category}
                  onChange={(v) => {
                    const newSkills: Record<string, string[]> = {};
                    for (const [key, val] of Object.entries(data.skills)) {
                      newSkills[key === category ? v : key] = val;
                    }
                    setData({ ...data, skills: newSkills });
                  }}
                />
                <DelimitedField
                  label="기술 (쉼표로 구분)"
                  values={skills}
                  onCommit={(nextSkills) => {
                    setData({
                      ...data,
                      skills: {
                        ...data.skills,
                        [category]: nextSkills,
                      },
                    });
                  }}
                />
              </div>
            ))}
          </Section>
        )}

        {/* Contact section */}
        {activeTab === "contact" && (
          <Section title="연락처">
            <TextArea
              label="소개 문구"
              value={data.contact.desc}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, desc: v },
                })
              }
              rows={2}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="이메일"
                value={data.contact.email}
                onChange={(v) =>
                  setData({
                    ...data,
                    contact: { ...data.contact, email: v },
                  })
                }
              />
              <Field
                label="전화번호"
                value={data.contact.phone}
                onChange={(v) =>
                  setData({
                    ...data,
                    contact: { ...data.contact, phone: v },
                  })
                }
              />
            </div>
            <Field
              label="주소"
              value={data.contact.address}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, address: v },
                })
              }
            />
            <Field
              label="홈페이지 URL"
              value={data.contact.homepage}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, homepage: v },
                })
              }
            />
            <Field
              label="GitHub URL"
              value={data.contact.github}
              onChange={(v) =>
                setData({
                  ...data,
                  contact: { ...data.contact, github: v },
                })
              }
            />
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">추가 연락처 항목</h3>
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      contact: {
                        ...data.contact,
                        extraItems: [
                          ...(data.contact.extraItems || []),
                          { label: "", value: "", href: "" },
                        ],
                      },
                    })
                  }
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + 항목 추가
                </button>
              </div>
              {(data.contact.extraItems || []).length === 0 ? (
                <p className="text-sm text-gray-500">
                  필요하면 블로그, 포트폴리오 PDF, 기타 링크를 추가할 수 있습니다.
                </p>
              ) : (
                (data.contact.extraItems || []).map((item, index) => (
                  <div key={index} className="glass rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm text-white font-medium">
                        추가 항목 {index + 1}
                      </h4>
                      <div className="flex items-center gap-1">
                        <MoveButton
                          direction="up"
                          disabled={index === 0}
                          onClick={() =>
                            setData({
                              ...data,
                              contact: {
                                ...data.contact,
                                extraItems: swap(
                                  data.contact.extraItems || [],
                                  index,
                                  index - 1
                                ),
                              },
                            })
                          }
                        />
                        <MoveButton
                          direction="down"
                          disabled={
                            index === (data.contact.extraItems || []).length - 1
                          }
                          onClick={() =>
                            setData({
                              ...data,
                              contact: {
                                ...data.contact,
                                extraItems: swap(
                                  data.contact.extraItems || [],
                                  index,
                                  index + 1
                                ),
                              },
                            })
                          }
                        />
                        <DeleteButton
                          onClick={() =>
                            setData({
                              ...data,
                              contact: {
                                ...data.contact,
                                extraItems: (data.contact.extraItems || []).filter(
                                  (_, i) => i !== index
                                ),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <Field
                      label="항목명"
                      value={item.label}
                      placeholder="예: 블로그"
                      onChange={(v) => {
                        const extraItems = [...(data.contact.extraItems || [])];
                        extraItems[index] = { ...extraItems[index], label: v };
                        setData({
                          ...data,
                          contact: { ...data.contact, extraItems },
                        });
                      }}
                    />
                    <Field
                      label="표시 내용"
                      value={item.value}
                      placeholder="예: velog.io/@username"
                      onChange={(v) => {
                        const extraItems = [...(data.contact.extraItems || [])];
                        extraItems[index] = { ...extraItems[index], value: v };
                        setData({
                          ...data,
                          contact: { ...data.contact, extraItems },
                        });
                      }}
                    />
                    <Field
                      label="연결 URL"
                      value={item.href}
                      placeholder="https://..."
                      onChange={(v) => {
                        const extraItems = [...(data.contact.extraItems || [])];
                        extraItems[index] = { ...extraItems[index], href: v };
                        setData({
                          ...data,
                          contact: { ...data.contact, extraItems },
                        });
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

/* ── Shared components ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-400 font-medium mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { e.stopPropagation(); }}
        onKeyUp={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation()}
        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all"
      />
    </div>
  );
}

function DelimitedField({
  label,
  values,
  onCommit,
  placeholder,
}: {
  label: string;
  values: string[];
  onCommit: (values: string[]) => void;
  placeholder?: string;
}) {
  const joined = values.join(", ");
  const [draft, setDraft] = useState(joined);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(joined);
  }, [joined, focused]);

  const commit = () => {
    onCommit(
      draft
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-400 font-medium mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); commit(); }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        onKeyUp={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation()}
        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-400 font-medium mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { e.stopPropagation(); }}
        onKeyUp={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation()}
        rows={rows}
        className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all resize-y"
      />
    </div>
  );
}

function MoveButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      title={direction === "up" ? "위로 이동" : "아래로 이동"}
    >
      {direction === "up" ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      )}
    </button>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={() => {
        if (confirm("정말 삭제하시겠습니까?")) onClick();
      }}
      className="w-7 h-7 flex items-center justify-center rounded-md text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
      title="삭제"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
  );
}

function ImageUpload({
  image,
  onChange,
}: {
  image: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.url) onChange(json.url);
    setUploading(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-400 font-medium mb-1.5">
        프로젝트 이미지
      </label>
      {image ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 mb-2">
          <img
            src={image}
            alt="프로젝트 미리보기"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors"
            >
              변경
            </button>
            <button
              onClick={() => onChange("")}
              className="px-3 py-1.5 rounded-lg bg-red-500/30 text-white text-xs font-medium hover:bg-red-500/50 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-lg border-2 border-dashed border-white/10 hover:border-blue-500/30 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-300 transition-all"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <span className="text-xs font-medium">클릭하여 이미지 업로드</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function FileUpload({
  accept,
  label,
  onUploaded,
}: {
  accept: string;
  label: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.url) onUploaded(json.url);
    setUploading(false);
  };

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 rounded-lg border border-dashed border-white/10 hover:border-blue-500/30 text-gray-500 hover:text-gray-300 text-xs font-medium transition-all"
      >
        {uploading ? "업로드 중..." : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
