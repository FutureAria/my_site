import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f3ec",
          color: "#25231f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 404,
            height: 404,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(37,35,31,0.16)",
            borderRadius: 48,
            background: "#fffaf2",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          PJY
        </div>
      </div>
    ),
    size,
  );
}
