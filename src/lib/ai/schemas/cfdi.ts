import { z } from "zod";

export const cfdiSchemaVersion = "1.0.0";

/* CFDI (Comprobante Fiscal Digital por Internet) — Mexican electronic invoice.
 * Used for broker fees, IVA, IGI accounting and other service charges
 * linked to an import operation. */
export const cfdiSchema = z.object({
  uuid: z.string(),
  emitterRfc: z.string(),
  receiverRfc: z.string(),
  amountMxn: z.number(),
  ivaMxn: z.number().optional(),
  totalMxn: z.number(),
  serviceDescription: z.string().optional(),
  issueDate: z.string(),
  /** Whether the SAT certificate seal validated client-side. */
  satSealValid: z.boolean().optional(),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type CFDIExtraction = z.infer<typeof cfdiSchema>;
