"use client";

import { useEffect, useRef, useState } from "react";

interface ContactData {
  desc?: string;
  email: string;
  address?: string;
  github?: string;
  extraItems?: {
    label: string;
    value: string;
    href?: string;
  }[];
}

export default function Contact({ data }: { data: ContactData }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else if (result.error === "SMTP_NOT_CONFIGURED") {
        // SMTP 미설정 시 mailto 링크로 폴백
        window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(`[문의] ${form.name}`)}&body=${encodeURIComponent(form.message)}`;
      } else {
        setSendError(result.error || "전송에 실패했습니다. 직접 이메일로 연락해주세요.");
      }
    } catch {
      setSendError("전송에 실패했습니다. 직접 이메일로 연락해주세요.");
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      label: "Email",
      value: data.email,
      href: `mailto:${data.email}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" ref={ref} className="scroll-mt-24 py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-3 block">
            연락처
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            연락<span className="gradient-text">처</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mb-6" />
          <p className="readable-copy text-gray-400 text-base max-w-2xl mx-auto leading-8 text-center">
            {data.desc || "함께 일하고 싶으시거나 궁금한 점이 있으시면 편하게 연락해 주세요."}
          </p>
        </div>

        <div
          className={`mx-auto mb-12 grid max-w-2xl grid-cols-1 gap-4 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {contactInfo.map((info) => {
            const content = (
              <>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors shrink-0">
                  {info.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {info.label}
                  </p>
                  <p className="mobile-safe-wrap text-white font-medium text-sm mt-0.5">
                    {info.value}
                  </p>
                </div>
              </>
            );

            if (!info.href) {
              return (
                <div
                  key={info.label}
                  className="glass rounded-xl p-5 flex items-start gap-4 transition-all duration-300 group"
                >
                  {content}
                </div>
              );
            }

            return (
              <a
                key={info.label}
                href={info.href}
                className="glass rounded-xl p-5 flex items-start gap-4 hover:bg-white/[0.06] transition-all duration-300 group"
              >
                {content}
              </a>
            );
          })}
        </div>

        {/* 연락처 폼 */}
        <div
          className={`transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div id="contact-form" className="glass scroll-mt-24 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-1">메시지 보내기</h3>
            <p className="text-sm text-gray-400 mb-4">아래 이메일로 직접 전달됩니다.</p>
            <a
              href={`mailto:${data.email}`}
              className="mb-6 flex w-fit max-w-full items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-sm font-semibold text-emerald-100 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/15"
            >
              <svg className="h-4 w-4 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="mobile-safe-wrap">{data.email}</span>
            </a>
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-semibold">메시지가 전송되었습니다!</p>
                <p className="text-gray-400 text-sm">빠른 시일 내에 답장드리겠습니다.</p>
                <button onClick={() => setSent(false)} className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  새 메시지 보내기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">이름</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="홍길동"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">이메일</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="example@email.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">메시지</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="안녕하세요! 포트폴리오 보고 연락드립니다..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all resize-none"
                  />
                </div>
                {sendError && (
                  <p className="text-sm text-red-400">{sendError}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="self-end px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      전송 중...
                    </>
                  ) : "전송하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
