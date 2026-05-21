import { FieldRow } from "./FieldRow";
import type { DocumentData } from "@/types";
import { FileText, CheckCircle2, XCircle } from "lucide-react";

const docTypeLabel: Record<string, string> = {
  pedimento: "Pedimento",
  invoice: "Commercial Invoice",
  bl: "Bill of Lading",
  packing_list: "Packing List",
  mve: "Minimum Value Estimate",
  cfdi: "CFDI",
  coo: "Certificate of Origin",
  carta_porte: "Carta Porte",
};

interface DocPreviewProps {
  document: DocumentData | null;
}

export function DocPreview({ document: doc }: DocPreviewProps) {
  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-xl" style={{ border: "1px dashed var(--hair-2)" }}>
        <FileText size={24} style={{ color: "var(--ink-4)" }} />
        <p className="text-sm mt-2" style={{ color: "var(--ink-4)" }}>Select a document to preview</p>
      </div>
    );
  }

  const passedChecks = doc.validationChecks.filter((c) => c.passed).length;
  const totalChecks = doc.validationChecks.length;

  return (
    <div className="space-y-4">
      {/* Doc header */}
      <div className="glass-panel-tight px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
            {docTypeLabel[doc.type] ?? doc.type}
          </p>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--ink-4)" }}>
            {doc.filename}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "var(--ok)" }}>
            {totalChecks > 0 ? `${passedChecks}/${totalChecks} checks passed` : doc.status}
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
            {Math.round(doc.confidence * 100)}% confidence
          </p>
        </div>
      </div>

      {/* Validation checks */}
      {doc.validationChecks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
            Validation Checks
          </p>
          {doc.validationChecks.map((check) => (
            <div key={check.id} className="flex items-center gap-2">
              {check.passed ? (
                <CheckCircle2 size={12} style={{ color: "var(--ok)", flexShrink: 0 }} />
              ) : (
                <XCircle size={12} style={{ color: "var(--risk)", flexShrink: 0 }} />
              )}
              <span className="text-xs" style={{ color: check.passed ? "var(--ink-3)" : "var(--risk)" }}>
                {check.checkName}
                {check.detail && ` — ${check.detail}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Extracted fields */}
      {doc.extractedFields.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
            Extracted Fields
          </p>
          {doc.extractedFields.map((field) => (
            <FieldRow
              key={field.id}
              label={field.label}
              value={field.value}
              confidence={field.confidence}
              mismatch={field.mismatch}
              mismatchRef={field.mismatchRef}
            />
          ))}
        </div>
      )}
    </div>
  );
}
