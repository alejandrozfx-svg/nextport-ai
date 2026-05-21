"use client";

import { useState, useMemo } from "react";
import { OperationRow } from "./OperationRow";
import { DEMO_OPERATIONS } from "@/lib/demo-data";
import Link from "next/link";

type TabKey = "all" | "risk" | "review" | "ready";

/* ── tiny inline icons ─────────────────────────────────── */
function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const s = { width: size, height: size, flexShrink: 0 as const };
  const icons: Record<string, React.ReactElement> = {
    upload:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alert:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="20 6 9 17 4 12"/></svg>,
    activity:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    dollar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    arrow_right: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };
  return icons[name] ?? <svg style={s} />;
}

/* ── FlowStrip ──────────────────────────────────────────── */
function FlowStrip() {
  const steps = [
    { key: "upload",    label: "Upload",             active: false },
    { key: "extract",   label: "AI extraction",      active: false },
    { key: "cross",     label: "Cross-check",        active: false },
    { key: "approve",   label: "Human approval",     active: true  },
    { key: "handoff",   label: "ERP / customs handoff", active: false },
  ];
  return (
    <div className="glass-panel-tight px-4 py-3 flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1">
          <div
            className="flex items-center gap-2 flex-1 py-1 px-2 rounded-lg text-[12px]"
            style={{
              background: s.active ? "var(--brand-soft)" : undefined,
              color: s.active ? "var(--brand)" : "var(--ink-4)",
            }}
          >
            {s.active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand)", boxShadow: "0 0 6px var(--brand)" }} />}
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <div className="flex-shrink-0 opacity-25 mx-1">
              <Icon name="arrow_right" size={10} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── StatCard ───────────────────────────────────────────── */
function StatCard({ label, value, sub, color, active, onClick }: {
  label: string; value: string | number; sub: string; color?: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <div
      className="glass-panel p-4 cursor-pointer transition-all"
      onClick={onClick}
      style={{
        outline: active ? `1px solid ${color ?? "var(--brand)"}` : undefined,
        background: active ? `${color ?? "var(--brand)"}1a` : undefined,
      }}
    >
      <div className="text-[11px] mb-1" style={{ color: "var(--ink-4)" }}>{label}</div>
      <div className="text-[24px] font-semibold tabular leading-none mb-1" style={{ color: color ?? "white" }}>
        {value}
      </div>
      <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{sub}</div>
    </div>
  );
}

/* ── Main inbox ─────────────────────────────────────────── */
export function OperationsInbox() {
  const [filter, setFilter] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [openUpload, setOpenUpload] = useState(false);

  const operations = DEMO_OPERATIONS;

  const filtered = useMemo(() => {
    return operations.filter((op) => {
      if (filter !== "all" && op.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          op.id.toLowerCase().includes(q) ||
          op.supplier.toLowerCase().includes(q) ||
          op.pedimento.toLowerCase().includes(q) ||
          op.origin.toLowerCase().includes(q) ||
          op.destination.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  const counts = {
    all:    operations.length,
    risk:   operations.filter((o) => o.status === "risk").length,
    review: operations.filter((o) => o.status === "review").length,
    ready:  operations.filter((o) => o.status === "ready").length,
  };

  const totalValue = operations.reduce((s, o) => s + o.value, 0);

  const tabs: { key: TabKey; label: string; color?: string }[] = [
    { key: "all",    label: "All operations" },
    { key: "risk",   label: "At risk",       color: "var(--risk)" },
    { key: "review", label: "Needs review",  color: "var(--warn)" },
    { key: "ready",  label: "Ready",         color: "var(--ok)" },
  ];

  return (
    <div className="px-8 py-7 space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "white" }}>Operations inbox</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-3)" }}>Control tower for active import operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm"><Icon name="search" size={13} /> Filter</button>
          <button className="btn btn-primary btn-sm" onClick={() => setOpenUpload(true)}>
            <Icon name="upload" size={13} /> Scan documents
          </button>
        </div>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label="Active operations" value={counts.all}    sub="This month"             active={filter === "all"}    onClick={() => setFilter("all")} />
        <StatCard label="At risk"           value={counts.risk}   sub="Blocking mismatch"      color="var(--risk)"  active={filter === "risk"}   onClick={() => setFilter("risk")} />
        <StatCard label="Needs review"      value={counts.review} sub="Missing document"       color="var(--warn)"  active={filter === "review"} onClick={() => setFilter("review")} />
        <StatCard label="Ready for handoff" value={counts.ready}  sub="Ready for handoff"      color="var(--ok)"    active={filter === "ready"}  onClick={() => setFilter("ready")} />
        <StatCard label="Customs value today" value={`$${(totalValue / 1000).toFixed(0)}k`} sub="USD equivalent" />
      </div>

      {/* Flow strip */}
      <FlowStrip />

      {/* Filter tabs + search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 glass-panel-tight p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] transition-all"
              style={{
                background: filter === t.key ? "rgba(255,255,255,0.08)" : "transparent",
                color: filter === t.key ? (t.color ?? "white") : "var(--ink-4)",
                boxShadow: filter === t.key ? "inset 0 0 0 1px var(--hair-2)" : undefined,
              }}
            >
              {t.label}
              <span className="ml-1.5 text-[11px] tabular" style={{ color: "var(--ink-4)" }}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg ml-auto glass-panel-tight">
          <Icon name="search" size={12} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operations…"
            className="bg-transparent text-[12.5px] outline-none w-48"
            style={{ color: "var(--ink)", caretColor: "var(--brand)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <table className="table" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 50 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              {["Status", "Supplier", "Route", "ETA", "Value", "Pedimento", "Documents", "Exc", "Owner"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10" style={{ color: "var(--ink-4)" }}>
                  No operations match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((op) => <OperationRow key={op.id} op={op} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Upload modal */}
      {openUpload && <UploadModal onClose={() => setOpenUpload(false)} />}
    </div>
  );
}

/* ── Scan / upload modal ────────────────────────────────── */
function UploadModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [files, setFiles] = useState<Array<{ name: string; type: string; size: string; progress: number; classified: boolean; extracted: number }>>([]);

  function startScan() {
    const dummy = [
      { name: "Pedimento_A1_26-47-3145-6002847.pdf", type: "Pedimento A1", size: "412 KB" },
      { name: "Invoice_LMT-44218.pdf",               type: "Invoice",      size: "186 KB" },
      { name: "BL_MAEU-7741229.pdf",                 type: "Bill of Lading", size: "248 KB" },
      { name: "PackingList_LMT-44218.pdf",           type: "Packing List", size: "94 KB"  },
      { name: "MVE_ScanCopy.pdf",                    type: "MVE",          size: "612 KB" },
      { name: "CFDI_Honorarios_Aduanas.xml",         type: "CFDI",         size: "12 KB"  },
    ];
    setFiles(dummy.map((d) => ({ ...d, progress: 0, classified: false, extracted: 0 })));
    setPhase("scanning");
    animateScan(dummy.length);
  }

  function animateScan(count: number) {
    const start = performance.now();
    function tick(now: number) {
      const e = (now - start) / 1000;
      setFiles((prev) => prev.map((f, i) => {
        const offset = i * 0.35;
        const p  = Math.max(0, Math.min(1, (e - offset) / 1.6));
        const ex = Math.max(0, Math.min(1, (e - offset - 1.0) / 1.5));
        return { ...f, progress: p, classified: p >= 1, extracted: Math.floor(ex * 24) };
      }));
      if (e < count * 0.35 + 3.0) {
        requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    }
    requestAnimationFrame(tick);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(4,6,10,0.65)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="glass-panel fade-up" style={{ width: 740, maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "var(--hair)" }}>
          <div className="flex items-center gap-2.5">
            <Icon name="upload" size={16} />
            <div>
              <div className="text-[15px]" style={{ color: "white" }}>Scan import documents</div>
              <div className="text-[12px]" style={{ color: "var(--ink-4)" }}>Drop pedimento, invoice, BL, packing list, MVE or CFDI — we classify, extract and cross-validate.</div>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>

        <div className="p-6">
          {phase === "idle" && (
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-dashed p-10 text-center" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.015)" }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center liquid-glass">
                  <Icon name="upload" size={18} />
                </div>
                <div className="text-[14px] mb-1.5" style={{ color: "white" }}>
                  Choose files <span style={{ color: "var(--ink-4)" }}>or drag & drop</span>
                </div>
                <div className="text-[12px] mb-4" style={{ color: "var(--ink-4)" }}>PDF · XML (CFDI) · ZIP · JPG up to 50 MB</div>
                <button className="btn btn-primary btn-sm mx-auto" onClick={startScan}>
                  Use sample expediente
                </button>
              </div>
            </div>
          )}

          {(phase === "scanning" || phase === "done") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[12.5px] flex items-center gap-2" style={{ color: "white" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    background: phase === "done" ? "var(--ok)" : "var(--brand)",
                    boxShadow: `0 0 8px ${phase === "done" ? "var(--ok)" : "var(--brand)"}`,
                  }} />
                  {phase === "done" ? "Extraction complete" : "Classifying & extracting…"}
                </div>
                <div className="text-[11px] font-mono tabular" style={{ color: "var(--ink-4)" }}>
                  {files.filter((f) => f.classified).length} / {files.length} classified
                </div>
              </div>
              <div className="space-y-1.5">
                {files.map((f) => (
                  <div key={f.name} className="glass-panel-tight px-3 py-2.5 flex items-center gap-3">
                    <div className="w-7 h-9 rounded-[3px] border flex-shrink-0" style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))", borderColor: "var(--hair-2)" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-[12.5px] truncate flex-1" style={{ color: "white" }}>{f.name}</div>
                        <div className="font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>{f.size}</div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="progress flex-1"><span style={{ width: `${f.progress * 100}%` }} /></div>
                        <div className="flex items-center gap-1.5 min-w-[150px] justify-end">
                          {f.classified ? (
                            <>
                              <span className={`chip chip-brand`}><span className="dot" />{f.type}</span>
                              <span className="text-[10.5px] font-mono tabular" style={{ color: "var(--ink-4)" }}>{f.extracted}/24 fields</span>
                            </>
                          ) : (
                            <span className="text-[10.5px] font-mono tabular" style={{ color: "var(--ink-4)" }}>{Math.round(f.progress * 100)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {phase === "done" && (
                <div className="glass-panel-tight p-3 mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--ok-soft)", border: "1px solid oklch(0.78 0.13 155 / 0.4)" }}>
                    <Icon name="check" size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px]" style={{ color: "white" }}>Operation NP-2026-001848 created from 6 documents.</div>
                    <div className="text-[11.5px]" style={{ color: "var(--ink-4)" }}>2 exceptions detected · awaiting human review.</div>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={onClose}>
                    Open operation <Icon name="arrow_right" size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

