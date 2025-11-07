"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

type ImageUploaderProps = {
  label: string;
  description?: string;
  value?: string;
  onUploaded: (url: string) => void;
  accept?: string;
  className?: string;
};

export function ImageUploader({ label, description, value, onUploaded, accept = "image/*", className }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);

    try {
      setUploading(true);
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = (await response.json()) as { url: string };
      onUploaded(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <p className="text-sm font-medium leading-none">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <Input ref={fileRef} type="file" accept={accept} onChange={handleFileChange} disabled={uploading} />
        <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {value && (
        <div className="mt-2 overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-32 w-full object-cover" />
        </div>
      )}
    </div>
  );
}

