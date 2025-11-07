import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUploadDir, saveFileFromBlob } from "@/lib/upload";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(assets);
  } catch (error) {
    logError("Failed to fetch media assets", error);
    return NextResponse.json({ message: "Unable to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    const originalName = (formData.get("filename") as string) ?? "upload";
    await ensureUploadDir();
    const upload = await saveFileFromBlob(file, originalName);

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: upload.filename,
        url: upload.url,
        mimeType: upload.mimeType,
        size: upload.size,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    logError("Failed to upload media", error);
    return NextResponse.json({ message: "Unable to upload media" }, { status: 500 });
  }
}

