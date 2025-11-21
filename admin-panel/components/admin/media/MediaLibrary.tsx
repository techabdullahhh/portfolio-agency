"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string | Date;
};

type MediaLibraryProps = {
  assets: MediaAsset[];
};

export function MediaLibrary({ assets }: MediaLibraryProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("");

  const filteredAssets = assets.filter((asset) => asset.filename.toLowerCase().includes(filter.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this file?")) return;
    const promise = fetch(`/api/media/${id}`, { method: "DELETE" }).then((response) => {
      if (!response.ok) throw new Error("Failed to delete media asset");
      router.refresh();
    });

    await toast.promise(promise, {
      loading: "Deleting file...",
      success: "File deleted",
      error: "Failed to delete file",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload</CardTitle>
          <CardDescription>Upload images to reuse across projects, services, and posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Use the media upload controls within each form to add new assets.</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Library</h2>
        <Input
          placeholder="Search by filename"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="group overflow-hidden rounded-xl border bg-card">
            <div className="relative h-40 w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="space-y-2 p-4 text-sm">
              <div className="truncate font-medium">{asset.filename}</div>
              <div className="text-xs text-muted-foreground">
                {(asset.size / 1024).toFixed(1)} KB &middot; {asset.mimeType}
              </div>
              <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(asset.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {filteredAssets.length === 0 && <p className="text-sm text-muted-foreground">No media files match this filter.</p>}
      </div>
    </div>
  );
}

