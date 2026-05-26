import { z } from "zod";

export const pedimentoSchemaVersion = "1.0.0";

export const pedimentoSchema = z.object({
  pedimentoNumber: z.string(),     // e.g. "26 47 3145 6002847"
  regime: z.string(),              // e.g. "A1" (importación definitiva)
  importer: z.object({
    name: z.string(),
    rfc: z.string(),
  }),
  brokerage: z.string().optional(),
  customsValueUsd: z.number(),
  invoiceValueUsd: z.number().optional(),
  hsBucket: z.string(),            // e.g. "8541.40.01"
  weightKg: z.number().optional(),
  igiAmountUsd: z.number().optional(),
  ivaAmountMxn: z.number().optional(),
  mode: z.string().optional(),     // Ocean / Air / Truck
  sectionalCustoms: z.string().optional(),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type PedimentoExtraction = z.infer<typeof pedimentoSchema>;
