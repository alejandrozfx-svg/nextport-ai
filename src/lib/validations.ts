import { z } from "zod";

export const ApprovalSchema = z.object({
  action: z.enum(["approved", "held", "review", "escalated", "correction_requested", "exported"]),
  note: z.string().optional(),
});

export const AssistantMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.string().optional(),
  conversationId: z.string().optional(),
});

export const DocumentScanSchema = z.object({
  operationId: z.string(),
  filename: z.string(),
  type: z.enum(["pedimento", "invoice", "bl", "packing_list", "mve", "cfdi", "coo", "carta_porte"]).optional(),
});

export const IntegrationSyncSchema = z.object({
  force: z.boolean().optional().default(false),
});

export const AcademyProgressSchema = z.object({
  completed: z.boolean(),
});

export type ApprovalInput = z.infer<typeof ApprovalSchema>;
export type AssistantMessageInput = z.infer<typeof AssistantMessageSchema>;
export type DocumentScanInput = z.infer<typeof DocumentScanSchema>;
