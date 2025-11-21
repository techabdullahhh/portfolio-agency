"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectInput, projectSchema, projectStatusOptions } from "@/lib/validators/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/dashboard/MarkdownEditor";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { Switch } from "@/components/ui/switch";
import { parseCsvToArray, arrayToCsv } from "@/lib/utils";

type ProjectFormProps = {
  defaultValues?: Partial<ProjectInput>;
  onSubmit: (data: ProjectInput) => Promise<void> | void;
  submitLabel?: string;
};

type ProjectFormValues = z.input<typeof projectSchema>;

export function ProjectForm({ defaultValues, onSubmit, submitLabel = "Save Project" }: ProjectFormProps) {
  const form = useForm<ProjectFormValues, undefined, ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      shortDescription: defaultValues?.shortDescription ?? "",
      content: defaultValues?.content ?? "",
      techStack: defaultValues?.techStack ?? [],
      tags: defaultValues?.tags ?? [],
      thumbnailUrl: defaultValues?.thumbnailUrl ?? "",
      bannerUrl: defaultValues?.bannerUrl ?? "",
      githubUrl: defaultValues?.githubUrl ?? "",
      liveUrl: defaultValues?.liveUrl ?? "",
      category: defaultValues?.category ?? "Web",
      status: defaultValues?.status ?? "ACTIVE",
      isFeatured: defaultValues?.isFeatured ?? false,
    } satisfies ProjectFormValues,
  });

  const { register, handleSubmit, formState, setValue, watch } = form;
  const { errors, isSubmitting } = formState;
  const [techStackText, setTechStackText] = useState(arrayToCsv(defaultValues?.techStack ?? []));
  const [tagsText, setTagsText] = useState(arrayToCsv(defaultValues?.tags ?? []));

  useEffect(() => {
    setValue("techStack", parseCsvToArray(techStackText), { shouldValidate: true });
  }, [techStackText, setValue]);

  useEffect(() => {
    setValue("tags", parseCsvToArray(tagsText), { shouldValidate: true });
  }, [tagsText, setValue]);

  const handleContentChange = (value: string) => {
    setValue("content", value, { shouldValidate: true });
  };

  const watchedContent = watch("content");
  const watchedFeatured = watch("isFeatured");

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
          <Input id="title" placeholder="AI-Assisted Dashboard" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="Web" {...register("category")} />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register("status")}>
            {projectStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace("_", " ")}
              </option>
            ))}
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea id="shortDescription" rows={3} placeholder="Summarize the project in a sentence." {...register("shortDescription")} />
          {errors.shortDescription && <p className="text-xs text-destructive">{errors.shortDescription.message}</p>}
        </div>
      </div>

      <MarkdownEditor
        label="Detailed Description"
        description="Supports Markdown and GitHub flavored tables."
        value={watchedContent}
        onChange={handleContentChange}
        placeholder="Write a detailed overview of the project including outcomes and metrics."
      />
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="techStack">Tech Stack</Label>
          <Input
            id="techStack"
            placeholder="Next.js, Prisma, Tailwind"
            value={techStackText}
            onChange={(event) => setTechStackText(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">Comma-separated list.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="SaaS, Analytics" value={tagsText} onChange={(event) => setTagsText(event.target.value)} />
          <p className="text-xs text-muted-foreground">Comma-separated list for filtering.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" placeholder="https://github.com/" {...register("githubUrl")} />
          {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input id="liveUrl" placeholder="https://" {...register("liveUrl")} />
          {errors.liveUrl && <p className="text-xs text-destructive">{errors.liveUrl.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploader
          label="Thumbnail"
          description="Displayed in listing cards."
          value={watch("thumbnailUrl") ?? undefined}
          onUploaded={(url) => setValue("thumbnailUrl", url, { shouldValidate: true })}
        />
        <ImageUploader
          label="Banner Image"
          description="Used on detail pages."
          value={watch("bannerUrl") ?? undefined}
          onUploaded={(url) => setValue("bannerUrl", url, { shouldValidate: true })}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={watchedFeatured} onCheckedChange={(checked) => setValue("isFeatured", checked, { shouldValidate: true })} />
        <div className="space-y-1">
          <Label className="leading-none">Feature this project</Label>
          <p className="text-xs text-muted-foreground">Featured projects appear on the homepage hero section.</p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

