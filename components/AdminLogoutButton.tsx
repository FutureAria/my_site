"use client";

import { useRouter } from "next/navigation";
import { adminApiPath } from "@/lib/admin-api";

export default function AdminLogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch(adminApiPath("admin-logout"), { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      className="mt-6 inline-flex h-10 items-center rounded-md border hairline px-4 text-sm font-semibold"
    >
      로그아웃
    </button>
  );
}
