import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "portfolio.json");

export async function GET() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);
  // adminPassword는 클라이언트에 노출하지 않음
  const { adminPassword: _, ...rest } = data;
  return NextResponse.json(rest);
}

export async function POST(request: Request) {
  const body = await request.json();
  // adminPassword 필드는 무시 (환경변수로 관리)
  const { adminPassword: _, ...rest } = body;
  fs.writeFileSync(dataPath, JSON.stringify(rest, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}
