"use client";

/* AI Test page (D-007 validation tool).
 *
 * Lets the user verify that Gemini extraction is actually reading the sample
 * PDFs — not just returning mock data labeled as Gemini. Each row shows:
 *  - The PDF iframe inline (you can see the actual content)
 *  - "Extract with AI" button → fires /api/ai/extract → renders the raw JSON
 *  - Model badge (gemini-2.5-flash-lite OR mock-v1) so it's obvious which fired
 *  - Latency + cached state
 *
 * The user manually verifies extracted values against the PDF content. No
 * trust required.
 */

import { useState } from "react";
import { ExternalLink, Loader2, PlayCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui";

interface SampleDoc {
  sampleId: string;
  docKind: string;
  pdfPath: string;
  filename: string;
  label: string;
}

const SAMPLES: SampleDoc[] = [
  { sampleId: "invoice",   docKind: "invoice",      pdfPath: "/sample-documents/01_commercial_invoice_dummy.pdf",          filename: "01_commercial_invoice_dummy.pdf",          label: "Commercial Invoice" },
  { sampleId: "packing",   docKind: "packing_list", pdfPath: "/sample-documents/02_packing_list_dummy.pdf",                filename: "02_packing_list_dummy.pdf",                label: "Packing List" },
  { sampleId: "bl",        docKind: "bl",           pdfPath: "/sample-documents/03_bill_of_lading_dummy.pdf",              filename: "03_bill_of_lading_dummy.pdf",              label: "Bill of Lading" },
  { sampleId: "pedimento", docKind: "pedimento",    pdfPath: "/sample-documents/04_pedimento_simplified_dummy.pdf",        filename: "04_pedimento_simplified_dummy.pdf",        label: "Pedimento A1" },
  { sampleId: "mve",       docKind: "mve",          pdfPath: "/sample-documents/05_manifestacion_valor_electronica_dummy.pdf", filename: "05_manifestacion_valor_electronica_dummy.pdf", label: "MVE — Manifestación de Valor" },
];

interface ExtractResult {
  model: string;
  latencyMs: number;
  cached: boolean;
  data: unknown;
  confidence?: Record<string, number>;
  error?: string;
}

interface RowState {
  loading: boolean;
  result?: ExtractResult;
}

export function AITestPage() {
  const [rows, setRows] = useState<Record<string, RowState>>({});

  async function runExtract(s: SampleDoc) {
    setRows((p) => ({ ...p, [s.sampleId]: { loading: true } }));
    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId: s.sampleId, docKind: s.docKind }),
      });
      const json = (await res.json()) as ExtractResult;
      setRows((p) => ({ ...p, [s.sampleId]: { loading: false, result: json } }));
    } catch (err) {
      setRows((p) => ({
        ...p,
        [s.sampleId]: {
          loading: false,
          result: { model: "error", latencyMs: 0, cached: false, data: null, error: err instanceof Error ? err.message : "unknown" },
        },
      }));
    }
  }

  async function runAll() {
    for (const s of SAMPLES) {
      // Sequential to respect free-tier RPM. Comment out for parallel if you have paid tier.
      await runExtract(s);
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow="AI validation"
        title="Test Gemini extraction against the real sample PDFs"
        subtitle="Each row shows the actual PDF + lets you fire the extract API. Compare the extracted JSON against the PDF content to verify the AI is real — not mock."
        actions={
          <button
            type="button"
            onClick={runAll}
            className="btn btn-primary justify-center"
          >
            <PlayCircle size={14} strokeWidth={1.8} />
            Run all (sequential)
          </button>
        }
      />

      {/* Honesty banner */}
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.3)" }}
      >
        <Sparkles size={16} strokeWidth={1.6} style={{ color: "var(--brand)", marginTop: 2 }} />
        <div className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
          <p>
            The <span className="font-mono">model</span> field in the response shows which provider ran. <span className="font-mono">gemini-2.5-flash-lite</span> means the
            request actually hit Google AI Studio with your <span className="font-mono">GEMINI_API_KEY</span>. <span className="font-mono">mock-v1</span> means it fell back
            (no key, rate-limit, or PDF not in the demo allowlist).
          </p>
          <p className="mt-1.5" style={{ color: "var(--ink-3)" }}>
            Open the PDF in the inline viewer + compare against the JSON below it. Numbers like <span className="font-mono">invoiceNumber</span>, <span className="font-mono">total</span>,
            <span className="font-mono">blNumber</span>, <span className="font-mono">pedimentoNumber</span> are easiest to spot-check.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {SAMPLES.map((s) => {
          const state = rows[s.sampleId];
          return (
            <section key={s.sampleId} className="glass-panel overflow-hidden">
              {/* Header */}
              <div
                className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderColor: "var(--hair)" }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>{s.label}</h3>
                    <span className="rounded-full px-2 py-0.5 font-mono text-[10px]" style={{ background: "var(--surface-2)", color: "var(--ink-3)", border: "1px solid var(--hair-2)" }}>
                      {s.docKind}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>{s.filename}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={s.pdfPath}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                  >
                    <ExternalLink size={11} strokeWidth={1.8} />
                    Open PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => runExtract(s)}
                    disabled={state?.loading}
                    className="btn btn-sm btn-primary"
                  >
                    {state?.loading ? <Loader2 size={11} className="animate-spin" /> : <PlayCircle size={11} strokeWidth={1.8} />}
                    {state?.loading ? "Extracting…" : "Extract with AI"}
                  </button>
                </div>
              </div>

              {/* Body — split: PDF iframe on left, JSON on right */}
              <div className="grid gap-3 p-4 lg:grid-cols-2">
                {/* Inline PDF */}
                <div
                  className="overflow-hidden rounded-lg border"
                  style={{ borderColor: "var(--hair-2)", background: "rgba(255,255,255,0.93)", height: 420 }}
                >
                  <iframe
                    src={`${s.pdfPath}#toolbar=0&navpanes=0`}
                    title={s.label}
                    className="h-full w-full bg-white"
                  />
                </div>

                {/* Extraction result */}
                <div className="overflow-hidden rounded-lg" style={{ background: "var(--bg)", border: "1px solid var(--hair-2)" }}>
                  {!state || (!state.loading && !state.result) ? (
                    <div className="flex h-full items-center justify-center p-6 text-center text-[12.5px]" style={{ color: "var(--ink-4)" }}>
                      Click <span className="mx-1 font-medium" style={{ color: "var(--ink-3)" }}>Extract with AI</span> to call the provider and see the raw JSON response.
                    </div>
                  ) : state.loading ? (
                    <div className="flex h-full items-center justify-center gap-2 p-6 text-[12.5px]" style={{ color: "var(--ink-4)" }}>
                      <Loader2 size={13} className="animate-spin" />
                      Calling /api/ai/extract…
                    </div>
                  ) : state.result?.error ? (
                    <div className="p-4 text-[12px]" style={{ color: "var(--risk)" }}>
                      <p className="font-semibold">Request failed</p>
                      <p className="mt-1 font-mono">{state.result.error}</p>
                    </div>
                  ) : state.result ? (
                    <>
                      {/* Meta strip */}
                      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 text-[11px]" style={{ borderColor: "var(--hair)" }}>
                        <span
                          className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
                          style={
                            state.result.model.startsWith("gemini")
                              ? { background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid oklch(0.78 0.13 155 / 0.4)" }
                              : { background: "var(--warn-soft)", color: "var(--warn)", border: "1px solid oklch(0.78 0.14 70 / 0.4)" }
                          }
                        >
                          {state.result.model}
                        </span>
                        <span className="font-mono" style={{ color: "var(--ink-4)" }}>
                          {state.result.latencyMs} ms
                        </span>
                        {state.result.cached && (
                          <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px]" style={{ color: "var(--ink-3)", border: "1px solid var(--hair-2)" }}>
                            cached
                          </span>
                        )}
                      </div>

                      {/* JSON dump */}
                      <pre
                        className="overflow-auto p-3 font-mono text-[11px] leading-relaxed"
                        style={{ color: "var(--ink-2)", maxHeight: 380 }}
                      >
                        {JSON.stringify(state.result.data, null, 2)}
                      </pre>
                    </>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer notes */}
      <div className="glass-panel-tight space-y-2 p-4 text-[12px]" style={{ color: "var(--ink-3)" }}>
        <p className="font-semibold" style={{ color: "var(--ink-2)" }}>How to validate manually</p>
        <ol className="ml-4 list-decimal space-y-1.5">
          <li>Open the PDF inline (left). Read the visible fields: invoice number, totals, BL number, container, pedimento number, dates, parties.</li>
          <li>Click <span className="font-mono">Extract with AI</span>. The right pane shows the raw JSON the provider returned.</li>
          <li>
            Compare key fields side-by-side. If the PDF says <span className="font-mono">INV-SZ-88021</span> and the JSON has <span className="font-mono">invoiceNumber: &quot;INV-SZ-88021&quot;</span>, the extraction is real.
          </li>
          <li>
            Spot the model: <span className="font-mono">gemini-2.5-flash-lite</span> = real AI Studio call. <span className="font-mono">mock-v1</span> = fallback (key missing, rate-limited, or PDF not in allowlist).
          </li>
          <li>Run the same extraction twice. The second call should return <span className="font-mono">cached: true</span> with <span className="font-mono">0 ms</span> latency.</li>
        </ol>
      </div>
    </div>
  );
}
