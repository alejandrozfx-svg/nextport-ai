/* Schema registry — keyed by DocKind.
 * Add new doc kinds here as schemas land. Each entry exposes the Zod schema
 * + a version string used in the extraction cache key.
 */

import type { ZodSchema } from "zod";
import type { DocKind } from "../provider";
import { invoiceSchema, invoiceSchemaVersion } from "./invoice";
import { blSchema, blSchemaVersion } from "./bl";
import { packingListSchema, packingListSchemaVersion } from "./packing-list";
import { pedimentoSchema, pedimentoSchemaVersion } from "./pedimento";
import { mveSchema, mveSchemaVersion } from "./mve";
import { cfdiSchema, cfdiSchemaVersion } from "./cfdi";
import { cooSchema, cooSchemaVersion } from "./coo";
import { cartaPorteSchema, cartaPorteSchemaVersion } from "./carta-porte";

interface SchemaEntry<T = unknown> {
  schema: ZodSchema<T>;
  version: string;
}

export const SCHEMAS: Record<DocKind, SchemaEntry> = {
  invoice:      { schema: invoiceSchema      as ZodSchema<unknown>, version: invoiceSchemaVersion },
  bl:           { schema: blSchema           as ZodSchema<unknown>, version: blSchemaVersion },
  packing_list: { schema: packingListSchema  as ZodSchema<unknown>, version: packingListSchemaVersion },
  pedimento:    { schema: pedimentoSchema    as ZodSchema<unknown>, version: pedimentoSchemaVersion },
  mve:          { schema: mveSchema          as ZodSchema<unknown>, version: mveSchemaVersion },
  cfdi:         { schema: cfdiSchema         as ZodSchema<unknown>, version: cfdiSchemaVersion },
  coo:          { schema: cooSchema          as ZodSchema<unknown>, version: cooSchemaVersion },
  carta_porte:  { schema: cartaPorteSchema   as ZodSchema<unknown>, version: cartaPorteSchemaVersion },
};

export { invoiceSchema, blSchema, packingListSchema, pedimentoSchema, mveSchema, cfdiSchema, cooSchema, cartaPorteSchema };
export type { InvoiceExtraction } from "./invoice";
export type { BLExtraction } from "./bl";
export type { PackingListExtraction } from "./packing-list";
export type { PedimentoExtraction } from "./pedimento";
export type { MVEExtraction } from "./mve";
export type { CFDIExtraction } from "./cfdi";
export type { COOExtraction } from "./coo";
export type { CartaPorteExtraction } from "./carta-porte";
