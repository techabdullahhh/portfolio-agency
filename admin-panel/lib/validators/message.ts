import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(10),
});

export const updateMessageSchema = z.object({
  isRead: z.boolean(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

