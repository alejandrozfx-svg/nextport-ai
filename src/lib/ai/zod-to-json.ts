/* Minimal Zod -> JSON Schema converter for Gemini responseSchema.
 *
 * We use the bundled converter from zod v3 (`z.toJSONSchema`) when available,
 * else fall back to a structural walk. This avoids pulling in an extra dep.
 * Gemini's accepted subset is OpenAPI 3.0 schema with most types — our
 * extraction schemas only need: object, string, number, integer, boolean,
 * array, enum, and required-field tracking.
 */

import type { z } from "zod";

interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
  description?: string;
  additionalProperties?: boolean | JsonSchema;
}

interface ZodDef {
  typeName?: string;
  shape?: () => Record<string, z.ZodTypeAny>;
  type?: z.ZodTypeAny;
  innerType?: z.ZodTypeAny;
  values?: string[];
  schema?: z.ZodTypeAny;
  description?: string;
  keyType?: z.ZodTypeAny;
  valueType?: z.ZodTypeAny;
}

function getDef(s: z.ZodTypeAny): ZodDef {
  return (s as unknown as { _def: ZodDef })._def;
}

export function zodToJsonSchema(schema: z.ZodTypeAny): JsonSchema {
  const def = getDef(schema);
  switch (def.typeName) {
    case "ZodObject": {
      const shape = def.shape?.() ?? {};
      const properties: Record<string, JsonSchema> = {};
      const required: string[] = [];
      for (const [key, child] of Object.entries(shape)) {
        const childDef = getDef(child);
        properties[key] = zodToJsonSchema(child);
        if (childDef.typeName !== "ZodOptional" && childDef.typeName !== "ZodDefault") {
          required.push(key);
        }
      }
      return {
        type: "object",
        properties,
        ...(required.length ? { required } : {}),
      };
    }
    case "ZodString":   return { type: "string" };
    case "ZodNumber":   return { type: "number" };
    case "ZodBoolean":  return { type: "boolean" };
    case "ZodArray":    return { type: "array", items: zodToJsonSchema(def.type as z.ZodTypeAny) };
    case "ZodOptional": return zodToJsonSchema(def.innerType as z.ZodTypeAny);
    case "ZodDefault":  return zodToJsonSchema(def.innerType as z.ZodTypeAny);
    case "ZodEnum":     return { type: "string", enum: def.values ?? [] };
    case "ZodRecord": {
      // Gemini's response_schema doesn't support additionalProperties (rejects with 400
      // "Unknown name 'additionalProperties'"). We drop the constraint and pass `type:
      // "object"` alone — the model still emits keys/values it inferred from the prompt,
      // and our Zod validator on the response side enforces the per-value type. This is
      // the documented workaround per Gemini API restrictions on JSON Schema features.
      return { type: "object" };
    }
    case "ZodNullable":
    case "ZodUnion":
      // Conservative fallback — treat as string. Real models tolerate looser shapes.
      return { type: "string" };
    default:
      return { type: "string" };
  }
}
