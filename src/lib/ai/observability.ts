/* Per-call observability — log model, latency, tokens, cached, success.
 * In demo: ring buffer of last 50 calls accessible via getRecentAICalls()
 * (also written to sessionStorage["np_ai_calls"] on the client when applicable).
 * In production: emit to Vercel logs (console.log JSON) + persist to a DB
 * table when we have one.
 */

import type { AIProviderName, DocKind } from "./provider";

export interface AICallLog {
  surface: "documents.extract" | "tutor.chat" | "operation.explain";
  provider: AIProviderName;
  model: string;
  docKind?: DocKind;
  pdfSha?: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
  cached: boolean;
  success: boolean;
  errorCode?: string;
  timestamp: string;
  tier: "free" | "paid";
}

const RING_SIZE = 50;
const buffer: AICallLog[] = [];

export function logAICall(partial: Omit<AICallLog, "timestamp" | "tier">): AICallLog {
  const log: AICallLog = {
    ...partial,
    timestamp: new Date().toISOString(),
    tier: process.env.AI_TIER === "paid" ? "paid" : "free",
  };
  buffer.push(log);
  if (buffer.length > RING_SIZE) buffer.shift();
  // Server logs (Vercel collects stdout). JSON for easy parsing.
  if (typeof window === "undefined") {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ ai_call: log }));
  }
  return log;
}

export function getRecentAICalls(): AICallLog[] {
  return [...buffer];
}

export function clearAICallBuffer(): void {
  buffer.length = 0;
}
