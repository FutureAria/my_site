import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "data", "portfolio.json");
const backupDir = path.join(process.cwd(), "data", "backups");
const backupPrefix = "portfolio-";
const backupSuffix = ".json";

function isPortfolioBackup(name: string) {
  return name.startsWith(backupPrefix) && name.endsWith(backupSuffix) && !name.includes("/");
}

async function readBackups() {
  try {
    const entries = await fs.readdir(backupDir, { withFileTypes: true });
    const backups = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && isPortfolioBackup(entry.name))
        .map(async (entry) => {
          const filePath = path.join(backupDir, entry.name);
          const stat = await fs.stat(filePath);
          let projectCount: number | null = null;

          try {
            const raw = await fs.readFile(filePath, "utf-8");
            const parsed = JSON.parse(raw);
            projectCount = Array.isArray(parsed.projects) ? parsed.projects.length : null;
          } catch {
            projectCount = null;
          }

          return {
            name: entry.name,
            size: stat.size,
            mtime: stat.mtime.toISOString(),
            projectCount,
          };
        }),
    );

    return backups.sort((a, b) => b.mtime.localeCompare(a.mtime));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export async function GET() {
  const backups = await readBackups();
  return NextResponse.json({ backups });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body?.name === "string" ? body.name : "";

  if (!isPortfolioBackup(name)) {
    return NextResponse.json({ error: "복원할 백업 파일이 올바르지 않습니다." }, { status: 400 });
  }

  const backupPath = path.join(backupDir, name);
  const resolvedBackupPath = path.resolve(backupPath);
  const resolvedBackupDir = path.resolve(backupDir);

  if (!resolvedBackupPath.startsWith(`${resolvedBackupDir}${path.sep}`)) {
    return NextResponse.json({ error: "복원할 백업 파일이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const raw = await fs.readFile(resolvedBackupPath, "utf-8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.projects)) {
      return NextResponse.json({ error: "프로젝트 데이터가 없는 백업입니다." }, { status: 400 });
    }

    await fs.mkdir(backupDir, { recursive: true });
    try {
      await fs.copyFile(dataPath, path.join(backupDir, `portfolio-before-restore-${timestampForFile()}.json`));
    } catch {
      // If current data is unavailable, still allow restoring a valid backup.
    }
    await fs.writeFile(dataPath, JSON.stringify(parsed, null, 2), "utf-8");

    return NextResponse.json({ success: true, restored: name });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "백업 파일을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ error: "백업 복원 중 오류가 발생했습니다." }, { status: 500 });
  }
}
