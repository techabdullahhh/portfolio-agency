"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BlogPostInput, blogPostSchema, publishStatusOptions } from "@/lib/validators/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/dashboard/MarkdownEditor";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { parseCsvToArray, arrayToCsv } from "@/lib/utils";

type BlogPostFormProps = {
  defaultValues?: Partial<BlogPostInput> & { publishedAt?: string | null };
  onSubmit: (data: BlogPostInput) => Promise<void> | void;
  submitLabel?: string;
};

type BlogPostFormValues = z.input<typeof blogPostSchema>;

export function BlogPostForm({ defaultValues, onSubmit, submitLabel = "Save Post" }: BlogPostFormProps) {
  const form = useForm<BlogPostFormValues, undefined, BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      excerpt: defaultValues?.excerpt ?? "",
      content: defaultValues?.content ?? "",
      tags: defaultValues?.tags ?? [],
      featuredImage: defaultValues?.featuredImage ?? "",
      publishedAt: defaultValues?.publishedAt ?? "",
      status: defaultValues?.status ?? "DRAFT",
      seoTitle: defaultValues?.seoTitle ?? "",
      seoDescription: defaultValues?.seoDescription ?? "",
    },
  });

  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors, isSubmitting } = formState;
  const [tagsText, setTagsText] = useState(arrayToCsv(defaultValues?.tags ?? []));

  useEffect(() => {
    setValue("tags", parseCsvToArray(tagsText), { shouldValidate: true });
  }, [tagsText, setValue]);

  const handleContentChange = (value: string) => setValue("content", value, { shouldValidate: true });

  const watchedContent = watch("content");
  const watchedFeaturedImage = watch("featuredImage");
  const watchedPublishedAt = watch("publishedAt");

  const handlePublishedAtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) {
      setValue("publishedAt", "", { shouldValidate: true });
      return;
    }
    const iso = new Date(value).toISOString();
    setValue("publishedAt", iso, { shouldValidate: true });
  };

  const formattedPublishedAt = watchedPublishedAt ? new Date(watchedPublishedAt).toISOString().slice(0, 16) : "";

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="How AI Scales Product Discovery" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register("status")}>
            {publishStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" rows={3} placeholder="Optional teaser used in previews." {...register("excerpt")} />
          {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
        </div>
      </div>

      <MarkdownEditor
        label="Content"
        description="Supports Markdown with tables, task lists, and code blocks."
        value={watchedContent}
        onChange={handleContentChange}
        placeholder="Write the full article here..."
      />
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="AI, Case Study" value={tagsText} onChange={(event) => setTagsText(event.target.value)} />
          <p className="text-xs text-muted-foreground">Comma-separated keywords.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="publishedAt">Publish Date</Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            value={formattedPublishedAt}
            onChange={handlePublishedAtChange}
          />
          {errors.publishedAt && <p className="text-xs text-destructive">{errors.publishedAt.message}</p>}
        </div>
      </div>

      <ImageUploader
        label="Featured Image"
        description="Displayed on listing cards and article header."
        value={watchedFeaturedImage ?? undefined}
        onUploaded={(url) => setValue("featuredImage", url, { shouldValidate: true })}
      />
      {errors.featuredImage && <p className="text-xs text-destructive">{errors.featuredImage.message}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input id="seoTitle" placeholder="Optional meta title" {...register("seoTitle")} />
          {errors.seoTitle && <p className="text-xs text-destructive">{errors.seoTitle.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea id="seoDescription" rows={2} placeholder="Optional meta description" {...register("seoDescription")} />
          {errors.seoDescription && <p className="text-xs text-destructive">{errors.seoDescription.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

