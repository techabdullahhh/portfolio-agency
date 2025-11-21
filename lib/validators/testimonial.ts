import { z } from "zod";

export const testimonialSchema = z.object({
  client: z.string().min(2).max(120),
  role: z.string().max(120).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  quote: z.string().min(10),
  rating: z.number().min(1).max(5).optional().nullable(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

