/* Extraction cache — keyed by `${pdfSha}:${schemaVersion}:${docKind}`.
 * In-memory (per Vercel function instance). Production should swap to
 * Vercel KV or Redis. TTL configurable via AI_CACHE_TTL_SECONDS env.
 */

import type { AIExtractResponse } from "./provider";

interface CacheEntry<T> {
  value: AIExtractResponse<T>;
  expiresAt: number;
}

const TTL_SECONDS = Number(process.env.AI_CACHE_TTL_SECONDS ?? 86400); // 24h
const store = new Map<string, CacheEntry<unknown>>();

export const extractionCache = {
  get<T>(key: string): AIExtractResponse<T> | null {
    const entry = store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },
  set<T>(key: string, value: AIExtractResponse<T>): void {
    store.set(key, { value: value as AIExtractResponse<unknown>, expiresAt: Date.now() + TTL_SECONDS * 1000 } as CacheEntry<unknown>);
  },
  clear(): void {
    store.clear();
  },
  size(): number {
    return store.size;
  },
};
