"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { adminApiPath } from "@/lib/admin-api";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("확인 중...");

    const response = await fetch(adminApiPath("admin-login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.trim() }),
    });

    if (!response.ok) {
      setMessage("비밀번호가 올바르지 않습니다. 한/영 입력 상태와 앞뒤 공백을 확인해주세요.");
      return;
    }

    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="surface mx-auto w-full max-w-md rounded-md p-6 sm:p-8">
      <p className="text-sm font-medium tracking-[0.2em] text-[color:var(--accent-strong)]">ADMIN LOGIN</p>
      <h1 className="mt-4 text-3xl font-semibold">관리자 비밀번호</h1>
      <p className="mt-3 text-sm leading-7 ink-muted">
        포트폴리오 내용을 수정하려면 비밀번호를 입력하세요.
      </p>
      <label className="mt-6 block text-sm">
        비밀번호
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoFocus
          className="mt-2 h-12 w-full rounded-md border hairline bg-transparent px-4 text-sm outline-none"
        />
      </label>
      {message && <p className="mt-3 text-sm ink-muted">{message}</p>}
      <button className="mt-6 h-11 w-full rounded-md bg-[color:var(--text)] px-5 text-sm font-semibold text-[color:var(--bg)]">
        들어가기
      </button>
    </form>
  );
}
