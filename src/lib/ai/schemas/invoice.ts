import { z } from "zod";

export const invoiceSchemaVersion = "1.0.0";

export const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  issueDate: z.string(), // ISO date
  supplier: z.object({
    name: z.string(),
    taxId: z.string().optional(),
    address: z.string().optional(),
  }),
  consignee: z.object({
    name: z.string(),
    rfc: z.string().optional(),
  }),
  incoterm: z.string().optional(),
  currency: z.string().length(3), // ISO 4217
  total: z.number(),
  lines: z.array(z.object({
    description: z.string(),
    qty: z.number(),
    unitPrice: z.number(),
    subtotal: z.number(),
  })),
  /** Optional confidence map produced by the extractor. */
  confidence: z.record(z.string(), z.number()).optional(),
});

export type InvoiceExtraction = z.infer<typeof invoiceSchema>;
