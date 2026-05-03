import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import type { PortfolioData } from "@/lib/portfolio";

const filePath = path.join(process.cwd(), "data", "portfolio.json");

export async function GET() {
  const raw = await fs.readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(request: Request) {
  try {
    const data = (await request.json()) as PortfolioData;

    if (!data.hero || !data.about || !Array.isArray(data.projects) || !Array.isArray(data.blog)) {
      return NextResponse.json({ message: "portfolio.json 형식이 올바르지 않습니다." }, { status: 400 });
    }

    data.settings = {
      ...data.settings,
      featuredProjectIndexes: (data.settings?.featuredProjectIndexes || [0, 1, 2])
        .map(Number)
        .filter((index) => Number.isInteger(index) && index >= 0 && index < data.projects.length)
        .slice(0, 3),
    };

    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
