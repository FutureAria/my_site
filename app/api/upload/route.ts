import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);
const imageMaxFileSize = 8 * 1024 * 1024;
const pdfMaxFileSize = 20 * 1024 * 1024;
const maxFiles = 20;
const targetImageMaxSize = 1.2 * 1024 * 1024;
const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

async function optimizeImage(bytes: Buffer) {
  const attempts = [
    { width: 1600, quality: 76 },
    { width: 1280, quality: 70 },
    { width: 1100, quality: 64 },
  ];

  let best: Buffer | null = null;

  for (const attempt of attempts) {
    const output = await sharp(bytes, { animated: false })
      .rotate()
      .resize({ width: attempt.width, withoutEnlargement: true })
      .webp({ quality: attempt.quality, effort: 5 })
      .toBuffer();

    if (!best || output.length < best.length) {
      best = output;
    }

    if (output.length <= targetImageMaxSize) {
      return output;
    }
  }

  return best || bytes;
}

function readUploadFiles(formData: FormData) {
  const multi = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File);
  const single = formData.get("file");

  if (multi.length > 0) return multi;
  return single instanceof File ? [single] : [];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = readUploadFiles(formData);

    if (files.length === 0) {
      return NextResponse.json(
        { message: "업로드할 파일이 없습니다." },
        { status: 400 },
      );
    }

    if (files.length > maxFiles) {
      return NextResponse.json(
        { message: `한 번에 최대 ${maxFiles}개까지 업로드할 수 있습니다.` },
        { status: 400 },
      );
    }

    const invalidFile = files.find((file) => {
      const maxFileSize =
        file.type === "application/pdf" ? pdfMaxFileSize : imageMaxFileSize;
      return !allowedTypes.has(file.type) || file.size > maxFileSize;
    });

    if (invalidFile) {
      if (!allowedTypes.has(invalidFile.type)) {
        return NextResponse.json(
          { message: "jpg, png, webp, gif, pdf 파일만 업로드할 수 있습니다." },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          message:
            "서버 용량 보호를 위해 이미지는 8MB, PDF는 20MB까지 업로드할 수 있습니다.",
        },
        { status: 413 },
      );
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const paths = await Promise.all(
      files.map(async (file, index) => {
        const isOptimizableImage =
          file.type !== "application/pdf" && file.type !== "image/gif";
        const ext = isOptimizableImage
          ? "webp"
          : extensionByType[file.type] || "bin";
        const safeName = `admin-${Date.now()}-${index}.${ext}`;
        const bytes = Buffer.from(await file.arrayBuffer());
        const output = isOptimizableImage ? await optimizeImage(bytes) : bytes;
        await fs.writeFile(path.join(uploadDir, safeName), output);
        return `/uploads/${safeName}`;
      }),
    );

    return NextResponse.json({ url: paths[0], paths });
  } catch {
    return NextResponse.json(
      { message: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
