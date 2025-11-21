import { z } from "zod";

export const projectStatusOptions = ["ACTIVE", "IN_PROGRESS", "ARCHIVED"] as const;

export const projectSchema = z.object({
  title: z.string().min(3).max(120),
  shortDescription: z.string().min(10).max(400),
  content: z.string().min(20),
  techStack: z.array(z.string().trim()).default([]),
  tags: z.array(z.string().trim()).default([]),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().min(2).max(60),
  status: z.enum(projectStatusOptions).default("ACTIVE"),
  isFeatured: z.boolean().optional().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;

