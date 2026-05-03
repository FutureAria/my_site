import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
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
  metadataBase: new URL("https://juyoung-portfolio.duckdns.org"),
  title: "박주영 | 백엔드 개발자 포트폴리오",
  description:
    "데이터 흐름과 API 기반 구조 설계를 중심으로 문제를 해결하는 백엔드 개발자 박주영의 포트폴리오입니다. Python, Java, React 등 다양한 기술 스택을 활용한 프로젝트를 확인하세요.",
  keywords: ["포트폴리오", "백엔드 개발자", "박주영", "Python", "Java", "React", "Next.js", "K-Digital"],
  manifest: "/manifest.webmanifest",
  applicationName: "JY Portfolio",
  appleWebApp: {
    capable: true,
    title: "JY Portfolio",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
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
        {/* 다크모드 플래시 방지: 렌더 전 localStorage 확인 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}else{document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
