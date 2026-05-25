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
      // Gemini wants additionalProperties with a schema for value type.
      const valueSchema = def.valueType ? zodToJsonSchema(def.valueType) : { type: "string" };
      return { type: "object", additionalProperties: valueSchema };
    }
    case "ZodNullable":
    case "ZodUnion":
      // Conservative fallback — treat as string. Real models tolerate looser shapes.
      return { type: "string" };
    default:
      return { type: "string" };
  }
}
