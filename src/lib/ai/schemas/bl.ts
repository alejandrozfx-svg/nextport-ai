import { z } from "zod";

export const blSchemaVersion = "1.0.0";

export const blSchema = z.object({
  blNumber: z.string(),
  carrier: z.string(),
  vessel: z.string().optional(),
  portOfLoading: z.string(),
  portOfDischarge: z.string(),
  eta: z.string().optional(), // ISO date
  shipper: z.string(),
  consignee: z.string(),
  containers: z.array(z.object({
    id: z.string(),
    seal: z.string().optional(),
    size: z.string().optional(), // e.g. "40HQ"
  })),
  packages: z.number(),
  grossWeightKg: z.number(),
  netWeightKg: z.number().optional(),
  cbm: z.number().optional(),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type BLExtraction = z.infer<typeof blSchema>;
