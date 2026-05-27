import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "portfolio_admin";
const ADMIN_COOKIE_VALUE = "ok";
const CSRF_COOKIE = "portfolio_admin_csrf";

function hasValidCsrfToken(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get("x-csrf-token");
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortfolioWriteApi = pathname === "/api/portfolio" && request.method !== "GET";
  const isUploadApi = pathname === "/api/upload";

  if (!isPortfolioWriteApi && !isUploadApi) {
    return NextResponse.next();
  }

  const isAuthed = request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
  if (!isAuthed) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  if (!hasValidCsrfToken(request)) {
    return NextResponse.json({ error: "요청 보안 토큰이 올바르지 않습니다." }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/portfolio", "/api/upload"],
};
