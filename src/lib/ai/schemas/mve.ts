import { z } from "zod";

export const mveSchemaVersion = "1.0.0";

/* Manifestación de Valor Electrónica — declares customs value computation
 * for an import operation. Cross-validated against the invoice. */
export const mveSchema = z.object({
  importerRfc: z.string(),
  relatedInvoice: z.string(),
  declaredValueUsd: z.number(),
  incoterm: z.string(),
  exchangeRate: z.number().optional(),
  signaturePresent: z.boolean(),
  /** When false the MVE is invalid for customs purposes. */
  signatureValid: z.boolean().optional(),
  emissionDate: z.string().optional(),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type MVEExtraction = z.infer<typeof mveSchema>;
