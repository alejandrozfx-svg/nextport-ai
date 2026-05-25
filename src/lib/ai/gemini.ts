/* Gemini adapter — extraction (PDF -> JSON) + fallback chat.
 *
 * Uses the v1beta generateContent REST API directly (no SDK dep so this
 * works on Vercel edge / serverless without bundle bloat). Structured
 * outputs via responseSchema (JSON Schema) — the model returns parsed JSON.
 *
 * Gated on GEMINI_API_KEY. When missing, throws — provider.ts catches and
 * falls back to mock.
 */

import { zodToJsonSchema } from "./zod-to-json";
import type { AIChatRequest, AIChatResponse, AIExtractRequest, AIExtractResponse } from "./provider";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("missing_gemini_api_key");
  return key;
}

/* Extraction — sends the PDF as inlineData. Gemini handles PDFs natively. */
export async function extractWithGemini<T>(req: AIExtractRequest<T>): Promise<AIExtractResponse<T>> {
  const apiKey = getApiKey();
  const model = DEFAULT_MODEL;
  const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;

  const responseSchema = zodToJsonSchema(req.schema);

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: "application/pdf",
              data: bufferToBase64(req.pdfBytes),
            },
          },
          {
            text: buildExtractionPrompt(req.docKind),
          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
      response_schema: responseSchema,
      temperature: 0.1,
    },
  };

  const start = performance.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`gemini_extract_failed_${res.status}_${txt.slice(0, 80)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    throw new Error("gemini_malformed_json");
  }
  const validated = req.schema.safeParse(parsedJson);
  if (!validated.success) {
    throw new Error("gemini_schema_validation_failed");
  }
  const data = validated.data as T;
  const latencyMs = performance.now() - start;
  const confidencePerField =
    (parsedJson as { confidence?: Record<string, number> }).confidence ?? undefined;
  return {
    data,
    model,
    latencyMs,
    cached: false,
    confidencePerField,
  };
}

/* Chat — single-turn for now. Used only if AI_PROVIDER=gemini (Groq is the
 * default chat path per D-007). */
export async function chatWithGemini(req: AIChatRequest): Promise<AIChatResponse> {
  const apiKey = getApiKey();
  const model = DEFAULT_MODEL;
  const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;

  const systemMsg = req.messages.find((m) => m.role === "system");
  const otherMsgs = req.messages.filter((m) => m.role !== "system");

  const body = {
    contents: otherMsgs.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    ...(systemMsg
      ? { systemInstruction: { parts: [{ text: systemMsg.content }] } }
      : {}),
    generationConfig: { temperature: 0.6 },
  };

  const start = performance.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`gemini_chat_failed_${res.status}_${txt.slice(0, 80)}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return { text, model, latencyMs: performance.now() - start };
}

function buildExtractionPrompt(docKind: string): string {
  return `You are a Mexican customs compliance extractor. Read the attached PDF (a ${docKind}) and return a JSON object matching the provided schema. For each top-level field include a 0-1 confidence in the "confidence" map. If a field is missing in the source, omit it (don't guess). Use ISO dates where applicable. Use ISO 4217 currency codes.`;
}

function bufferToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  // Browser fallback (shouldn't fire — extraction runs server-side).
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
