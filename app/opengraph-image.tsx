import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f7f3ec",
          color: "#25231f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#465440" }}>
          <span>박주영</span>
          <span>Portfolio Archive</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 86, lineHeight: 1.08, fontWeight: 700, letterSpacing: 0 }}>
            기록하고,
            <br />
            만들고,
            <br />
            오래 남기는 사람
          </div>
          <div style={{ marginTop: 36, maxWidth: 780, fontSize: 28, lineHeight: 1.45, color: "#756f66" }}>
            프로젝트, 생각, 이미지와 경험을 차분히 모아둔 개인 포트폴리오입니다.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
