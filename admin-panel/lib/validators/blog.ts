import { z } from "zod";

export const publishStatusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const blogPostSchema = z.object({
  title: z.string().min(5).max(160),
  excerpt: z.string().max(320).optional().or(z.literal("")),
  content: z.string().min(50),
  tags: z.array(z.string().trim()).default([]),
  featuredImage: z.string().url().optional().or(z.literal("")),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
  status: z.enum(publishStatusOptions).default("DRAFT"),
  seoTitle: z.string().max(160).optional().or(z.literal("")),
  seoDescription: z.string().max(320).optional().or(z.literal("")),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

