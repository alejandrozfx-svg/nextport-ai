import { z } from "zod";

export const cartaPorteSchemaVersion = "1.0.0";

/* Carta Porte CFDI (electronic transport waybill — MX domestic legs, 2022+).
 * Mandatory for SAT. Validates the domestic transit segment of an import. */
export const cartaPorteSchema = z.object({
  cartaPorteUuid: z.string(),
  transporterRfc: z.string(),
  transporterName: z.string(),
  transportMode: z.enum(["truck", "rail", "ocean", "air", "intermodal"]),
  vehicleId: z.string().optional(),
  driverLicense: z.string().optional(),
  originAddress: z.string(),
  destinationAddress: z.string(),
  totalDistanceKm: z.number().optional(),
  totalWeightKg: z.number().optional(),
  segments: z.array(z.object({
    sequence: z.number(),
    from: z.string(),
    to: z.string(),
    distanceKm: z.number().optional(),
  })).optional(),
  confidence: z.record(z.string(), z.number()).optional(),
});

export type CartaPorteExtraction = z.infer<typeof cartaPorteSchema>;
