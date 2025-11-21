import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./public/uploads";

export type UploadResult = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};

export async function ensureUploadDir() {
  const directory = path.resolve(process.cwd(), UPLOAD_DIR);
  await fs.mkdir(directory, { recursive: true });
  return directory;
}

export async function saveFileFromBlob(file: Blob, originalName: string): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadDir = await ensureUploadDir();
  let ext = path.extname(originalName) || "";
  if (!ext && file.type) {
    const inferred = file.type.split("/")[1];
    if (inferred) {
      ext = `.${inferred}`;
    }
  }
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, "");
  const safeBase = base || "asset";
  const filename = `${safeBase}-${Date.now()}${ext}`.toLowerCase();
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${filename}`;

  return {
    url: publicUrl,
    filename,
    size: buffer.length,
    mimeType: file.type,
  };
}

export async function deleteUploadedFile(url: string) {
  if (!url.startsWith("/uploads")) return;
  const uploadDir = await ensureUploadDir();
  const filePath = path.join(uploadDir, path.basename(url));
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

