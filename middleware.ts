import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "portfolio_admin";
const ADMIN_COOKIE_VALUE = "ok";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortfolioWriteApi = pathname === "/api/portfolio" && request.method !== "GET";
  const isUploadApi = pathname === "/api/upload";

  if (!isPortfolioWriteApi && !isUploadApi) {
    return NextResponse.next();
  }

  const isAuthed = request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
  if (isAuthed) return NextResponse.next();

  return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
}

export const config = {
  matcher: ["/api/portfolio", "/api/upload"],
};
