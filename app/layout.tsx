import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "박주영 | 백엔드 개발자 포트폴리오",
  description:
    "데이터 흐름과 API 기반 구조 설계를 중심으로 문제를 해결하는 백엔드 개발자 박주영의 포트폴리오입니다. Python, Java, React 등 다양한 기술 스택을 활용한 프로젝트를 확인하세요.",
  keywords: ["포트폴리오", "백엔드 개발자", "박주영", "Python", "Java", "React", "Next.js", "K-Digital"],
  openGraph: {
    title: "박주영 | 백엔드 개발자 포트폴리오",
    description: "데이터 흐름과 API 기반 구조 설계를 중심으로 문제를 해결하는 백엔드 개발자",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`scroll-smooth ${inter.variable} ${notoSansKr.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#030712" />
        {/* 다크모드 플래시 방지: 렌더 전 localStorage 확인 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
