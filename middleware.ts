import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "portfolio_admin";
const ADMIN_COOKIE_VALUE = "ok";

export function middleware(request: NextRequest) {
  if (process.env.DOTHOME_STATIC_BUILD === "true") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin/login";
  const isPortfolioWriteApi = pathname === "/api/portfolio" && request.method !== "GET";
  const isUploadApi = pathname === "/api/upload";

  if ((!isAdminPage && !isPortfolioWriteApi && !isUploadApi) || isAdminLogin) {
    return NextResponse.next();
  }

  const isAuthed = request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;

  if (isAuthed) {
    return NextResponse.next();
  }

  if (isPortfolioWriteApi || isUploadApi) {
    return NextResponse.json({ message: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/portfolio", "/api/upload"],
};
