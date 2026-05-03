import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "박주영 | 기록하고, 만들고, 오래 남기는 사람",
  description: "프로젝트, 생각, 이미지와 경험을 차분히 모아둔 개인 포트폴리오입니다.",
  keywords: ["박주영", "포트폴리오", "백엔드 개발자", "프로젝트", "개인 홈페이지"],
  authors: [{ name: "박주영" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "박주영 | 기록하고, 만들고, 오래 남기는 사람",
    description: "프로젝트, 생각, 이미지와 경험을 차분히 모아둔 개인 포트폴리오입니다.",
    url: siteUrl,
    siteName: "박주영 Portfolio Archive",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "박주영 Portfolio Archive" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "박주영 | 기록하고, 만들고, 오래 남기는 사람",
    description: "프로젝트, 생각, 이미지와 경험을 차분히 모아둔 개인 포트폴리오입니다.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
