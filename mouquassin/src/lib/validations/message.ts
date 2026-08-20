import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  senderId: z.string().min(1, "Sender ID is required"),
  senderName: z.string().min(1, "Sender name is required").max(100),
  content: z.string().min(1, "Message cannot be empty").max(2000),
});

export const markReadSchema = z.object({
  messageId: z.string().min(1, "Message ID is required"),
});
