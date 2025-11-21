import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10),
  icon: z.string().url().optional().or(z.literal("")),
  category: z.string().min(2).max(60).optional().or(z.literal("")),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

