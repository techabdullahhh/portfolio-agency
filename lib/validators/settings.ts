import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(2).max(120),
  tagline: z.string().max(240).optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  socialLinks: z
    .object({
      twitter: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      github: z.string().url().optional().or(z.literal("")),
      dribbble: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
    })
    .partial()
    .default({}),
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  footerText: z.string().max(400).optional().or(z.literal("")),
  theme: z.enum(["light", "dark", "system"]).default("light"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

