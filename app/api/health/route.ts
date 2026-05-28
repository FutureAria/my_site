import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "data", "portfolio.json");
const uploadsPath = path.join(process.cwd(), "public", "uploads");
const adminCookie = "portfolio_admin";

function checkPortfolioData() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);
  return Array.isArray(data.projects);
}

export async function GET() {
  const isAdmin = (await cookies()).get(adminCookie)?.value === "ok";
  const checks = {
    portfolioData: false,
    uploadsDirectory: false,
  };

  try {
    checks.portfolioData = checkPortfolioData();
    checks.uploadsDirectory = fs.existsSync(uploadsPath) && fs.statSync(uploadsPath).isDirectory();
  } catch {
    // Keep the health payload small and avoid exposing filesystem details.
  }

  const ok = Object.values(checks).every(Boolean);

  return NextResponse.json(
    isAdmin
      ? {
          ok,
          checks,
          checkedAt: new Date().toISOString(),
        }
      : {
          ok,
          checkedAt: new Date().toISOString(),
        },
    {
      status: ok ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
