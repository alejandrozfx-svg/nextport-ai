import { z } from "zod";

export const packingListSchemaVersion = "1.0.0";

export const packingListSchema = z.object({
  documentNumber: z.string(),
  invoiceRef: z.string().optional(),
  origin: z.string(),
  packages: z.number(),
  totalGrossWeightKg: z.number(),
  totalNetWeightKg: z.number(),
  lines: z.array(z.object({
    carton: z.string(),
    contents: z.string(),
    qty: z.number(),
    grossKg: z.number(),
  })),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type PackingListExtraction = z.infer<typeof packingListSchema>;
