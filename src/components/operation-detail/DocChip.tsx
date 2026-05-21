import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, FileText, Scan, CheckCheck } from "lucide-react";

type DocStatus = "uploaded" | "classified" | "extracted" | "validated" | "ready";

interface DocChipProps {
  type: string;
  status: DocStatus;
  confidence: number;
  active?: boolean;
  onClick?: () => void;
}

const statusIcon: Record<DocStatus, React.ReactNode> = {
  uploaded: <Clock size={10} />,
  classified: <Scan size={10} />,
  extracted: <FileText size={10} />,
  validated: <CheckCircle2 size={10} />,
  ready: <CheckCheck size={10} />,
};

const statusColor: Record<DocStatus, string> = {
  uploaded: "var(--ink-4)",
  classified: "var(--brand)",
  extracted: "var(--brand)",
  validated: "var(--warn)",
  ready: "var(--ok)",
};

const docTypeLabel: Record<string, string> = {
  pedimento: "PED",
  invoice: "INV",
  bl: "B/L",
  packing_list: "PKG",
  mve: "MVE",
  cfdi: "CFDI",
  coo: "COO",
  carta_porte: "CP",
};

export function DocChip({ type, status, confidence, active, onClick }: DocChipProps) {
  const color = statusColor[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all",
        active ? "ring-1" : "hover:opacity-80"
      )}
      style={{
        background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "var(--hair-2)" : "var(--hair)"}`,
        outline: active ? "1px solid var(--brand)" : undefined,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-semibold" style={{ color: "var(--ink)" }}>
          {docTypeLabel[type] ?? type.toUpperCase()}
        </span>
        <span style={{ color }}>{statusIcon[status]}</span>
      </div>
      <div className="flex items-center gap-1">
        <div
          className="h-1 rounded-full overflow-hidden flex-1"
          style={{ background: "var(--hair)" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${confidence * 100}%`, background: color }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color, fontSize: 9 }}>
          {Math.round(confidence * 100)}%
        </span>
      </div>
    </button>
  );
}
