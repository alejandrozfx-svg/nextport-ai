/* Groq adapter — chat only. Llama 3.3 70B versatile by default.
 * Fast token throughput; ideal for Tutor / Q&A / explanations.
 *
 * Gated on GROQ_API_KEY. When missing, throws — provider.ts catches and
 * falls back to mock keyword responses.
 */

import type { AIChatRequest, AIChatResponse } from "./provider";

const DEFAULT_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("missing_groq_api_key");
  return key;
}

export async function chatWithGroq(req: AIChatRequest): Promise<AIChatResponse> {
  const apiKey = getApiKey();
  const model = DEFAULT_MODEL;

  const body = {
    model,
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: 0.6,
    max_tokens: 512,
    stream: false,
  };

  const start = performance.now();
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`groq_chat_failed_${res.status}_${txt.slice(0, 80)}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = json.choices?.[0]?.message?.content ?? "";
  return { text, model, latencyMs: performance.now() - start };
}
