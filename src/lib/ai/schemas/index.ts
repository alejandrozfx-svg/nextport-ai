/* Schema registry — keyed by DocKind.
 * Add new doc kinds here as schemas land. Each entry exposes the Zod schema
 * + a version string used in the extraction cache key.
 */

import type { ZodSchema } from "zod";
import type { DocKind } from "../provider";
import { invoiceSchema, invoiceSchemaVersion } from "./invoice";
import { blSchema, blSchemaVersion } from "./bl";
import { packingListSchema, packingListSchemaVersion } from "./packing-list";

interface SchemaEntry<T = unknown> {
  schema: ZodSchema<T>;
  version: string;
}

export const SCHEMAS: Partial<Record<DocKind, SchemaEntry>> = {
  invoice:      { schema: invoiceSchema      as ZodSchema<unknown>, version: invoiceSchemaVersion },
  bl:           { schema: blSchema           as ZodSchema<unknown>, version: blSchemaVersion },
  packing_list: { schema: packingListSchema  as ZodSchema<unknown>, version: packingListSchemaVersion },
  // TODO: pedimento, mve, cfdi, coo, carta_porte
};

export { invoiceSchema, blSchema, packingListSchema };
export type { InvoiceExtraction } from "./invoice";
export type { BLExtraction } from "./bl";
export type { PackingListExtraction } from "./packing-list";
