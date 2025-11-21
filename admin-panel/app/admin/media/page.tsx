import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

export const metadata: Metadata = {
  title: "Media Library",
};

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <p className="text-sm text-muted-foreground">Manage creative assets used across the site.</p>
      </div>
      <MediaLibrary assets={assets} />
    </div>
  );
}

