#!/usr/bin/env node
/* Warm-cache: compute SHA-256 for every PDF in /public/sample-documents/
 * and print them as the literal Set<string> body for DEMO_SHA_ALLOWLIST in
 * src/lib/ai/provider.ts.
 *
 * Run: node scripts/warm-cache.mjs
 */

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE_DIR = path.join(__dirname, "..", "public", "sample-documents");

async function main() {
  const files = (await readdir(SAMPLE_DIR))
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  console.log(`Sample PDFs found: ${files.length}\n`);

  const entries = [];
  for (const filename of files) {
    const buf = await readFile(path.join(SAMPLE_DIR, filename));
    const sha = createHash("sha256").update(buf).digest("hex");
    entries.push({ filename, sha, size: buf.length });
    console.log(`${sha}  ${filename}  (${buf.length} bytes)`);
  }

  console.log("\n--- Paste into src/lib/ai/provider.ts DEMO_SHA_ALLOWLIST ---\n");
  console.log("const DEMO_SHA_ALLOWLIST = new Set<string>([");
  for (const { filename, sha } of entries) {
    console.log(`  "${sha}", // ${filename}`);
  }
  console.log("]);");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
