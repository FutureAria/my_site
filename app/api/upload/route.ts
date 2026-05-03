import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const imageMaxFileSize = 3 * 1024 * 1024;
const pdfMaxFileSize = 8 * 1024 * 1024;
const maxFiles = 20;
const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ message: "업로드할 이미지가 없습니다." }, { status: 400 });
    }

    if (files.length > maxFiles) {
      return NextResponse.json({ message: `이미지는 한 번에 최대 ${maxFiles}장까지 업로드할 수 있습니다.` }, { status: 400 });
    }

    const invalidFile = files.find((file) => {
      const maxFileSize = file.type === "application/pdf" ? pdfMaxFileSize : imageMaxFileSize;
      return !allowedTypes.has(file.type) || file.size > maxFileSize;
    });
    if (invalidFile) {
      if (!allowedTypes.has(invalidFile.type)) {
        return NextResponse.json({ message: "jpg, png, webp, gif, pdf 파일만 업로드할 수 있습니다." }, { status: 400 });
      }

      return NextResponse.json({ message: "서버 용량 보호를 위해 이미지는 3MB, PDF는 8MB까지 업로드할 수 있습니다." }, { status: 400 });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const paths = await Promise.all(
      files.map(async (file, index) => {
        const ext = extensionByType[file.type] || "png";
        const safeName = `admin-${Date.now()}-${index}.${ext}`;
        const bytes = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(path.join(uploadDir, safeName), bytes);
        return `/uploads/${safeName}`;
      }),
    );

    return NextResponse.json({ paths });
  } catch {
    return NextResponse.json({ message: "이미지 업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
