import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  bio: z.string().min(10),
  skills: z.array(z.string().trim()).default([]),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

