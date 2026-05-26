import { z } from "zod";

export const cooSchemaVersion = "1.0.0";

/* Certificate of Origin. Required to claim preferential treatment under
 * T-MEC / USMCA, TPP, CPTPP and other trade agreements. */
export const cooSchema = z.object({
  certificateNumber: z.string(),
  issuer: z.string(),
  originCountry: z.string(),
  treaty: z.string(),                            // e.g. "T-MEC", "CPTPP"
  preferenceCriterion: z.enum(["A", "B", "C", "D"]).optional(),
  producer: z.string().optional(),
  exporter: z.string().optional(),
  importer: z.string().optional(),
  periodStart: z.string().optional(),            // ISO date
  periodEnd: z.string().optional(),
  hsCodesCovered: z.array(z.string()).optional(),
  signaturePresent: z.boolean(),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type COOExtraction = z.infer<typeof cooSchema>;
