"use client";

import { useState, useEffect } from "react";
import { FileText, ScanLine, CheckCircle2, Clock, Scan, Upload, X } from "lucide-react";
import { RiskChip } from "@/components/ui/RiskChip";
import { formatDate } from "@/lib/utils";

interface DocumentItem {
  id: string;
  type: string;
  filename: string;
  status: string;
  confidence: number;
  source: string;
  uploadedAt: string;
  operation: { id: string; supplier: { shortName: string } };
}

const statusIcon: Record<string, React.ReactNode> = {
  uploaded: <Clock size={12} />,
  classified: <Scan size={12} />,
  extracted: <FileText size={12} />,
  validated: <CheckCircle2 size={12} />,
  ready: <CheckCircle2 size={12} />,
};

const statusColor: Record<string, string> = {
  uploaded: "var(--ink-4)",
  classified: "var(--brand)",
  extracted: "var(--brand)",
  validated: "var(--warn)",
  ready: "var(--ok)",
};

const docTypeLabel: Record<string, string> = {
  pedimento: "Pedimento",
  invoice: "Invoice",
  bl: "Bill of Lading",
  packing_list: "Packing List",
  mve: "MVE",
  cfdi: "CFDI",
  coo: "Certificate of Origin",
  carta_porte: "Carta Porte",
};

const DEMO_DOCUMENTS: DocumentItem[] = [
  { id: "d1",  type: "pedimento",    filename: "Pedimento_A1_26-47-3145-6002847.pdf", status: "ready",      confidence: 0.998, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d2",  type: "invoice",      filename: "Invoice_LMT-44218.pdf",               status: "validated",  confidence: 0.995, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d3",  type: "bl",           filename: "BL_MAEU-7741229.pdf",                 status: "ready",      confidence: 0.991, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d4",  type: "packing_list", filename: "PackingList_LMT-44218.pdf",           status: "ready",      confidence: 0.989, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d5",  type: "mve",          filename: "MVE_ScanCopy.pdf",                    status: "ready",      confidence: 0.972, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d6",  type: "cfdi",         filename: "CFDI_Honorarios_Aduanas.xml",          status: "ready",      confidence: 0.999, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d7",  type: "pedimento",    filename: "Pedimento_A1_26-47-1108-6002846.pdf", status: "ready",      confidence: 0.994, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
  { id: "d8",  type: "invoice",      filename: "Invoice_TCH-2026-0419.pdf",           status: "ready",      confidence: 0.987, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
  { id: "d9",  type: "bl",           filename: "BL_KMTC-990442.pdf",                 status: "ready",      confidence: 0.980, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
  { id: "d10", type: "packing_list", filename: "PL-TCH-2026-0419.pdf",               status: "classified", confidence: 0.962, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
];

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanFilename, setScanFilename] = useState("");
  const [scanOpId, setScanOpId] = useState("NP-2026-001847");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    setDocuments(DEMO_DOCUMENTS);
    setLoading(false);
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/documents", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d.documents?.length) setDocuments(d.documents); })
      .catch(() => {});
  }, []);

  const filtered = filter === "all" ? documents : documents.filter((d) => d.type === filter);

  async function handleScan() {
    if (!scanFilename.trim()) return;
    setScanning(true);
    try {
      const res = await fetch("/api/documents/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: scanOpId, filename: scanFilename }),
      });
      const data = await res.json();
      if (data.document) {
        setDocuments((prev) => [
          { ...data.document, operation: { id: scanOpId, supplier: { shortName: "Manual" } } },
          ...prev,
        ]);
      }
      setScanOpen(false);
      setScanFilename("");
    } catch (e) {
      console.error(e);
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
            Document Library
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>
            {documents.length} documents · AI-classified
          </p>
        </div>
        <button
          onClick={() => setScanOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--brand)", color: "#0A0D12" }}
        >
          <ScanLine size={14} />
          Scan Document
        </button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-1.5">
        {["all", "pedimento", "invoice", "bl", "packing_list", "mve", "cfdi", "coo", "carta_porte"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={
              filter === t
                ? { background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.3)" }
                : { background: "var(--hair)", color: "var(--ink-4)", border: "1px solid transparent" }
            }
          >
            {t === "all" ? "All types" : (docTypeLabel[t] ?? t)}
          </button>
        ))}
      </div>

      {/* Documents grid */}
      {loading ? (
        <div className="p-12 text-center" style={{ color: "var(--ink-4)" }}>Loading documents…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((doc) => {
            const color = statusColor[doc.status] ?? "var(--ink-4)";
            return (
              <div key={doc.id} className="glass-panel p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--hair)" }}
                    >
                      <FileText size={14} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                        {docTypeLabel[doc.type] ?? doc.type}
                      </p>
                      <p className="text-xs font-mono truncate max-w-[120px]" style={{ color: "var(--ink-4)" }}>
                        {doc.filename}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color }}>
                    {statusIcon[doc.status]}
                    <span className="capitalize">{doc.status}</span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: "var(--ink-4)" }}>Confidence</span>
                    <span className="text-xs font-mono" style={{ color }}>
                      {Math.round(doc.confidence * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--hair)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${doc.confidence * 100}%`, background: color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: "var(--ink-4)" }}>
                  <span className="font-mono">{doc.operation.id}</span>
                  <span>{formatDate(doc.uploadedAt)}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 p-12 text-center" style={{ color: "var(--ink-4)" }}>
              No documents found.
            </div>
          )}
        </div>
      )}

      {/* Scan Modal */}
      {scanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="glass-panel p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Scan Document</h3>
              <button onClick={() => setScanOpen(false)}>
                <X size={16} style={{ color: "var(--ink-4)" }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "var(--ink-4)" }}>Filename</label>
                <input
                  value={scanFilename}
                  onChange={(e) => setScanFilename(e.target.value)}
                  placeholder="e.g. invoice-lumitech-001.pdf"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "var(--ink-4)" }}>Operation ID</label>
                <input
                  value={scanOpId}
                  onChange={(e) => setScanOpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
                  style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setScanOpen(false)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ border: "1px solid var(--hair-2)", color: "var(--ink-3)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex-1 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                style={{ background: "var(--brand)", color: "#0A0D12" }}
              >
                {scanning ? "Scanning…" : "Scan & Classify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
