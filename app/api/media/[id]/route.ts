import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUploadedFile } from "@/lib/upload";
import { logError } from "@/lib/logger";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await deleteUploadedFile(asset.url);
    await prisma.mediaAsset.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to delete media asset", error);
    return NextResponse.json({ message: "Unable to delete media asset" }, { status: 500 });
  }
}

