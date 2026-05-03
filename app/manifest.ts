import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "박주영 Portfolio Archive",
    short_name: "박주영",
    description: "기록하고, 만들고, 오래 남기는 사람. 박주영의 프로젝트와 기록을 모은 포트폴리오입니다.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f3ec",
    theme_color: "#f7f3ec",
    categories: ["portfolio", "productivity", "education"],
    lang: "ko-KR",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
