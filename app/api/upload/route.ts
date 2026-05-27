import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const uploadLogPath = path.join(process.cwd(), "data", "upload-events.jsonl");
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
]);
const imageMaxFileSize = 8 * 1024 * 1024;
const documentMaxFileSize = 20 * 1024 * 1024;
const maxFiles = 20;
const targetImageMaxSize = 1.2 * 1024 * 1024;
const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-powerpoint": "ppt",
};

const documentTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
]);

function startsWithSignature(bytes: Buffer, signature: number[]) {
  if (bytes.length < signature.length) return false;
  return signature.every((value, index) => bytes[index] === value);
}

function isValidFileSignature(type: string, bytes: Buffer) {
  switch (type) {
    case "image/jpeg":
      return startsWithSignature(bytes, [0xff, 0xd8, 0xff]);
    case "image/png":
      return startsWithSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/webp":
      return bytes.slice(0, 4).toString("ascii") === "RIFF" && bytes.slice(8, 12).toString("ascii") === "WEBP";
    case "image/gif":
      return bytes.slice(0, 6).toString("ascii") === "GIF87a" || bytes.slice(0, 6).toString("ascii") === "GIF89a";
    case "application/pdf":
      return bytes.slice(0, 5).toString("ascii") === "%PDF-";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return startsWithSignature(bytes, [0x50, 0x4b, 0x03, 0x04]) || startsWithSignature(bytes, [0x50, 0x4b, 0x05, 0x06]) || startsWithSignature(bytes, [0x50, 0x4b, 0x07, 0x08]);
    case "application/vnd.ms-excel":
    case "application/vnd.ms-powerpoint":
      return startsWithSignature(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    default:
      return false;
  }
}

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

async function appendUploadLog(paths: string[], files: File[]) {
  await fs.mkdir(path.dirname(uploadLogPath), { recursive: true });
  const records = paths.map((url, index) => ({
    at: new Date().toISOString(),
    url,
    type: files[index]?.type || "",
    size: files[index]?.size || 0,
  }));
  await fs.appendFile(
    uploadLogPath,
    records.map((record) => JSON.stringify(record)).join("\n") + "\n",
    "utf-8",
  );
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
      const isDocument = documentTypes.has(file.type);
      const maxFileSize = isDocument ? documentMaxFileSize : imageMaxFileSize;
      return !allowedTypes.has(file.type) || file.size > maxFileSize;
    });

    if (invalidFile) {
      if (!allowedTypes.has(invalidFile.type)) {
        return NextResponse.json(
          { message: "jpg, png, webp, gif, pdf, xlsx, xls, pptx, ppt 파일만 업로드할 수 있습니다." },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          message:
            "서버 용량 보호를 위해 이미지는 8MB, 문서는 20MB까지 업로드할 수 있습니다.",
        },
        { status: 413 },
      );
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const paths = await Promise.all(
      files.map(async (file, index) => {
        const isOptimizableImage =
          file.type.startsWith("image/") && file.type !== "image/gif";
        const ext = isOptimizableImage
          ? "webp"
          : extensionByType[file.type] || "bin";
        const safeName = `admin-${crypto.randomUUID()}-${index}.${ext}`;
        const bytes = Buffer.from(await file.arrayBuffer());

        if (!isValidFileSignature(file.type, bytes)) {
          throw new Error("INVALID_FILE_SIGNATURE");
        }

        const output = isOptimizableImage ? await optimizeImage(bytes) : bytes;
        await fs.writeFile(path.join(uploadDir, safeName), output);
        return `/uploads/${safeName}`;
      }),
    );

    await appendUploadLog(paths, files);

    return NextResponse.json({ url: paths[0], paths });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_FILE_SIGNATURE") {
      return NextResponse.json(
        { message: "파일 형식이 확장자와 일치하지 않습니다. 원본 파일을 다시 확인해주세요." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
