import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-this-password";
const ADMIN_COOKIE = "portfolio_admin";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
