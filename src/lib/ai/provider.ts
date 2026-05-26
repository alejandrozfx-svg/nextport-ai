/* AI provider abstraction — D-007 pillar.
 * Surfaces extraction (PDF -> structured JSON) and chat (conversational Q&A)
 * with a free-tier guard, mock fallback, SHA-256 keyed cache and
 * call-level observability.
 *
 * Provider selection by env: AI_PROVIDER=gemini|groq|mock (default: mock).
 * Free-tier guard (AI_TIER=free) rejects any extract() request whose
 * payload SHA is not in the demo allowlist.
 */

import type { z } from "zod";
import { mockProvider } from "./mock";
import { extractWithGemini, chatWithGemini } from "./gemini";
import { chatWithGroq } from "./groq";
import { extractionCache } from "./cache";
import { logAICall } from "./observability";
import { sha256Hex } from "./hash";

export type AIProviderName = "gemini" | "groq" | "mock";

export type DocKind = "invoice" | "bl" | "packing_list" | "pedimento" | "mve" | "cfdi" | "coo" | "carta_porte";

export interface AIExtractRequest<T> {
  pdfBytes: Uint8Array;
  schema: z.ZodSchema<T>;
  schemaVersion: string;
  docKind: DocKind;
  /** Pre-computed SHA hex (skip hashing if you already have it). */
  pdfSha?: string;
}

export interface AIExtractResponse<T> {
  data: T;
  model: string;
  latencyMs: number;
  cached: boolean;
  confidencePerField?: Record<string, number>;
}

export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIChatRequest {
  messages: AIChatMessage[];
  context?: string;
}

export interface AIChatResponse {
  text: string;
  model: string;
  latencyMs: number;
  relatedLessons?: string[];
  suggestedAction?: string;
}

function getProviderName(): AIProviderName {
  const env = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (env === "gemini" || env === "groq") return env;
  return "mock";
}

function getTier(): "free" | "paid" {
  return process.env.AI_TIER === "paid" ? "paid" : "free";
}

/* Demo PDF allowlist — only files served from /public/sample-documents/ are
 * allowed to hit a real LLM on the free tier. Production / paid tier disables
 * this guard. Hashes computed at request time and compared against the
 * snapshot below. Regenerate with `node scripts/warm-cache.mjs` whenever the
 * sample PDFs change. */
const DEMO_SHA_ALLOWLIST = new Set<string>([
  "049389914d702360e99c5d331138e742a8424198de39f96d313561415fb9fc0a", // 00_document_guide_dummy.pdf
  "8ad9cdff68cc4231fc75fb9f456ec43ef91ef205cdbc562b3f0da27bb6fb15b8", // 01_commercial_invoice_dummy.pdf
  "9ae6d2bf4779af28271613193c0c012de006b753bc113923cb065d95ea2b5dc5", // 02_packing_list_dummy.pdf
  "5e7c59ec902350430ca28de5882588ed836e8d46a16c5c4c31303ac9ab6d76b9", // 03_bill_of_lading_dummy.pdf
  "cc77d04e4338b0ec224c0850ab00a844e9136a0b04bd6c11fa862d20e08f4e30", // 04_pedimento_simplified_dummy.pdf
  "6c77a68b4269bf4c82dc96c532e4e564d62c83fb6c4371ec2b9e6e9a2b9cea7a", // 05_manifestacion_valor_electronica_dummy.pdf
]);

async function validateDemoTier(pdfSha: string): Promise<boolean> {
  if (getTier() === "paid") return true;
  return DEMO_SHA_ALLOWLIST.has(pdfSha);
}

export async function extract<T>(req: AIExtractRequest<T>): Promise<AIExtractResponse<T>> {
  const start = performance.now();
  const provider = getProviderName();
  const pdfSha = req.pdfSha ?? (await sha256Hex(req.pdfBytes));
  const cacheKey = `${pdfSha}:${req.schemaVersion}:${req.docKind}`;

  // 1. Cache hit -> return immediately.
  const cached = extractionCache.get<T>(cacheKey);
  if (cached) {
    const latencyMs = performance.now() - start;
    logAICall({
      surface: "documents.extract",
      provider,
      model: cached.model,
      docKind: req.docKind,
      pdfSha,
      latencyMs,
      cached: true,
      success: true,
    });
    return { ...cached, latencyMs, cached: true };
  }

  // 2. Free-tier guard. Real customer PDFs must NOT hit a free LLM.
  const allowed = await validateDemoTier(pdfSha);
  if (!allowed && provider !== "mock") {
    // Fall back to mock + warn in logs (don't throw — the app must keep working).
    const result = await mockProvider.extract(req);
    extractionCache.set(cacheKey, result);
    logAICall({
      surface: "documents.extract",
      provider: "mock",
      model: result.model,
      docKind: req.docKind,
      pdfSha,
      latencyMs: performance.now() - start,
      cached: false,
      success: true,
      errorCode: "tier_guard_fallback",
    });
    return { ...result, cached: false };
  }

  // 3. Provider path.
  try {
    let result: AIExtractResponse<T>;
    if (provider === "gemini") {
      result = await extractWithGemini(req);
    } else {
      result = await mockProvider.extract(req);
    }
    extractionCache.set(cacheKey, result);
    logAICall({
      surface: "documents.extract",
      provider,
      model: result.model,
      docKind: req.docKind,
      pdfSha,
      latencyMs: performance.now() - start,
      cached: false,
      success: true,
    });
    return result;
  } catch (err) {
    // 4. Hard failure -> mock fallback (the demo must never break).
    const result = await mockProvider.extract(req);
    extractionCache.set(cacheKey, result);
    logAICall({
      surface: "documents.extract",
      provider: "mock",
      model: result.model,
      docKind: req.docKind,
      pdfSha,
      latencyMs: performance.now() - start,
      cached: false,
      success: false,
      errorCode: err instanceof Error ? err.message.slice(0, 64) : "unknown_error",
    });
    return result;
  }
}

export async function chat(req: AIChatRequest): Promise<AIChatResponse> {
  const start = performance.now();
  const provider = getProviderName();
  try {
    let result: AIChatResponse;
    if (provider === "groq") {
      result = await chatWithGroq(req);
    } else if (provider === "gemini") {
      result = await chatWithGemini(req);
    } else {
      result = await mockProvider.chat(req);
    }
    logAICall({
      surface: "tutor.chat",
      provider,
      model: result.model,
      latencyMs: performance.now() - start,
      cached: false,
      success: true,
    });
    return result;
  } catch (err) {
    const result = await mockProvider.chat(req);
    logAICall({
      surface: "tutor.chat",
      provider: "mock",
      model: result.model,
      latencyMs: performance.now() - start,
      cached: false,
      success: false,
      errorCode: err instanceof Error ? err.message.slice(0, 64) : "unknown_error",
    });
    return result;
  }
}

/* Re-exports for convenience. */
export { sha256Hex } from "./hash";
export { extractionCache } from "./cache";
