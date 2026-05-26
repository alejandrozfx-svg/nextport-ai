/* /api/ai/extract — server route that runs provider.extract() against a
 * sample PDF in /public/sample-documents/. Used by UploadModal to show
 * real model attribution during the scan animation.
 *
 * Request body:
 *   { sampleId: string, docKind: DocKind }
 *
 * Response:
 *   { model: string, latencyMs: number, cached: boolean,
 *     data: <validated extraction>, confidence?: Record<string, number> }
 *
 * The provider layer enforces the AI_TIER=free guard, so this endpoint will
 * fall back to mock if the sample's SHA isn't in the demo allowlist.
 */

import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { extract, type DocKind } from "@/lib/ai/provider";
import { SCHEMAS } from "@/lib/ai/schemas";

const REQUEST_SCHEMA = z.object({
  sampleId: z.string().regex(/^[A-Za-z0-9_-]+$/), // safe filename slug
  docKind: z.enum(["invoice", "bl", "packing_list", "pedimento", "mve", "cfdi", "coo", "carta_porte"]),
});

/* Allowlisted sample IDs -> filenames in /public/sample-documents/.
 * Hard-coded so a request can't escape the directory or read arbitrary files. */
const SAMPLE_MAP: Record<string, string> = {
  invoice:     "01_commercial_invoice_dummy.pdf",
  packing:     "02_packing_list_dummy.pdf",
  bl:          "03_bill_of_lading_dummy.pdf",
  pedimento:   "04_pedimento_simplified_dummy.pdf",
  mve:         "05_manifestacion_valor_electronica_dummy.pdf",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = REQUEST_SCHEMA.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    const { sampleId, docKind } = parsed.data;

    const filename = SAMPLE_MAP[sampleId];
    let pdfBytes: Uint8Array;
    if (filename) {
      const pdfPath = path.join(process.cwd(), "public", "sample-documents", filename);
      const buf = await readFile(pdfPath);
      pdfBytes = new Uint8Array(buf);
    } else {
      // Sample not in the map (e.g. cfdi / coo / carta_porte have no PDF yet)
      // -> hand the provider an empty PDF; the mock fallback returns canned data.
      pdfBytes = new Uint8Array(0);
    }

    const entry = SCHEMAS[docKind as DocKind];
    const result = await extract({
      pdfBytes,
      schema: entry.schema,
      schemaVersion: entry.version,
      docKind: docKind as DocKind,
    });

    return NextResponse.json({
      model: result.model,
      latencyMs: Math.round(result.latencyMs),
      cached: result.cached,
      data: result.data,
      confidence: result.confidencePerField,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "extract_failed", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
