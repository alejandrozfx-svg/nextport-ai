"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { DemoOperation } from "@/lib/demo-data";
import { useLang } from "@/lib/lang-context";
import { t, type TranslationKey } from "@/lib/i18n";

/* ── icons ──────────────────────────────────────────────── */
function Icon({ name, size = 14, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  const s = { width: size, height: size, flexShrink: 0 as const, ...style };
  const icons: Record<string, React.ReactElement> = {
    arrow_left:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="15 18 9 12 15 6"/></svg>,
    shield:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    file:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    history:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.32"/></svg>,
    link:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    sparkle:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
    alert:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    check:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="20 6 9 17 4 12"/></svg>,
    eye:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    chevron_right:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="9 18 15 12 9 6"/></svg>,
    arrow_right:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    user:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    flag:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    download:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    info:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    x:            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };
  return icons[name] ?? <svg style={s} />;
}

function Chip({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <span className={`chip chip-${kind}`}>
      <span className="dot" />
      {children}
    </span>
  );
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2 text-[12px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.85)" }}>
      <Icon name={icon} size={13} style={{ opacity: 0.7 }} />
      {children}
    </div>
  );
}

/* ── DocChip ─────────────────────────────────────────────── */
function DocChip({ doc, active, highlighted, onClick, hasFlag }: {
  doc: string; active: boolean; highlighted: boolean; hasFlag?: boolean; onClick: () => void;
}) {
  return (
    <div
      className={`doc-chip ${active ? "active" : ""}`}
      onClick={onClick}
      style={highlighted && !active ? { boxShadow: "0 0 0 1px var(--risk), 0 0 18px oklch(0.70 0.16 25 / 0.25)" } : undefined}
    >
      <div className="ico" />
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] truncate" style={{ color: "white" }}>{doc}</div>
        <div className="text-[10.5px] font-mono" style={{ color: "var(--ink-4)" }}>PDF · 1.4 MB</div>
      </div>
      {(hasFlag || highlighted) && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--risk)", boxShadow: "0 0 6px var(--risk)" }} />
      )}
    </div>
  );
}

/* ── Exception card ──────────────────────────────────────── */
function ExceptionCard({ flag, active, onClick }: {
  flag: DemoOperation["flags"][0]; active: boolean; onClick: () => void;
}) {
  const iconColor = flag.kind === "risk" ? "var(--risk)" : "var(--warn)";
  return (
    <div
      className="glass-panel-tight p-3 cursor-pointer transition-colors"
      onClick={onClick}
      style={{
        background: active ? "oklch(0.70 0.16 25 / 0.10)" : undefined,
        boxShadow: active ? "inset 0 0 0 1px oklch(0.70 0.16 25 / 0.5)" : undefined,
      }}
    >
      <div className="flex items-start gap-2.5">
        <Icon name="alert" size={14} style={{ color: iconColor, marginTop: 1 }} />
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] leading-snug" style={{ color: "white" }}>{flag.title}</div>
          <div className="text-[11.5px] leading-snug mt-1" style={{ color: "var(--ink-3)" }}>{flag.detail}</div>
          {flag.ref.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {flag.ref.map((r, i) => (
                <span key={i} className="font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: "var(--hair-2)", color: "var(--ink-3)" }}>{r}</span>
              ))}
            </div>
          )}
        </div>
        <Icon name={active ? "eye" : "chevron_right"} size={12} style={{ opacity: 0.6, marginTop: 1 }} />
      </div>
    </div>
  );
}

/* ── NextBestAction ─────────────────────────────────────── */
function NextBestAction({ action }: { action: NonNullable<DemoOperation["recommendedAction"]> }) {
  const { lang } = useLang();

  return (
    <div className="glass-panel p-4" style={{
      background: "linear-gradient(180deg, oklch(0.78 0.09 235 / 0.10), rgba(255,255,255,0.02))",
      borderColor: "oklch(0.78 0.09 235 / 0.25)",
    }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.4)" }}>
          <Icon name="sparkle" size={11} style={{ color: "var(--brand)" }} />
        </div>
        <div className="text-[11px] tracking-[0.12em] uppercase" style={{ color: "var(--ink-3)" }}>{t("recommendedAction", lang)}</div>
      </div>
      <div className="text-[14px] leading-snug mb-1.5" style={{ color: "white" }}>{t(action.titleKey, lang)}</div>
      <div className="text-[12px] leading-snug mb-3" style={{ color: "var(--ink-3)" }}>{t(action.whyKey, lang)}</div>
      <button className="btn btn-primary w-full justify-center mb-2">
        <Icon name="arrow_right" size={13} />
        {t(action.primary, lang)}
      </button>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${action.secondary.length}, 1fr)` }}>
        {action.secondary.map((s) => (
          <button key={s} className="btn btn-sm justify-center" style={{ fontSize: 11, padding: "5px 8px" }}>{t(s, lang)}</button>
        ))}
      </div>
    </div>
  );
}

/* ── ApprovalRow ─────────────────────────────────────────── */
function ApprovalRow({ label, who, status }: { label: string; who: string; status: "done" | "pending" | "queued" | "blocked" }) {
  const { lang } = useLang();
  const map = {
    done:    { icon: "check",   color: "var(--ok)",   text: t("approvedStatus", lang) },
    pending: { icon: "user",    color: "var(--warn)",  text: t("awaitingYou", lang) },
    queued:  { icon: "history", color: "var(--ink-3)", text: t("queuedStatus", lang) },
    blocked: { icon: "x",       color: "var(--ink-4)", text: t("blockedStatus", lang) },
  }[status];
  return (
    <div className="flex items-center gap-2.5 py-2 border-t" style={{ borderColor: "var(--hair)" }}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--hair-2)" }}>
        <Icon name={map.icon} size={11} style={{ color: map.color }} />
      </div>
      <div className="flex-1">
        <div className="text-[12px]" style={{ color: "white" }}>{label}</div>
        <div className="text-[11px]" style={{ color: "var(--ink-3)" }}>{who} · {map.text}</div>
      </div>
    </div>
  );
}

/* ── FieldStatusChip ─────────────────────────────────────── */
function FieldStatusChip({ status }: { status: "ok" | "warn" | "risk" }) {
  const { lang } = useLang();
  if (status === "ok")   return <Chip kind="ok">{t("matchStatus", lang)}</Chip>;
  if (status === "warn") return <Chip kind="warn">{t("checkStatus", lang)}</Chip>;
  return <Chip kind="risk">{t("mismatchStatus", lang)}</Chip>;
}

/* ── FieldRow ────────────────────────────────────────────── */
function FieldRow({ label, value, mono, status, note, highlighted }: {
  label: string; value: string; mono?: boolean; status: "ok" | "warn" | "risk";
  note?: string | null; highlighted?: boolean;
}) {
  const cls = `field-row${status === "risk" ? " mismatch" : ""}`;
  return (
    <div className={cls} style={{
      background: highlighted ? "oklch(0.70 0.16 25 / 0.12)" : (status === "warn" ? "rgba(255,200,80,0.04)" : undefined),
      boxShadow: highlighted ? "inset 0 0 0 1px oklch(0.70 0.16 25 / 0.6)" : undefined,
      borderRadius: highlighted ? 8 : undefined,
      transition: "background .25s ease, box-shadow .25s ease",
    }}>
      <div className="field-label">{label}</div>
      <div>
        <div className={`field-value${mono ? " font-mono tabular" : ""}`}>{value}</div>
        {note && <div className="text-[10.5px]" style={{ color: status === "risk" ? "var(--risk)" : "var(--warn)" }}>{note}</div>}
      </div>
      <FieldStatusChip status={status} />
    </div>
  );
}

/* ── PDField (inside doc previews) ─────────────────────── */
function PDField({ label, value, mono, highlight }: {
  label: string; value: string; mono?: boolean; highlight?: boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      <div style={{
        fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
        fontSize: mono ? 11.5 : 12.5,
        color: highlight ? "oklch(0.92 0.08 25)" : "white",
        fontWeight: highlight ? 600 : 400,
      }}>{value}</div>
    </div>
  );
}

/* ── Doc previews ────────────────────────────────────────── */
function PreviewFrame({ children, stamp }: { children: React.ReactNode; stamp: string }) {
  return (
    <div className="doc-preview" style={{ aspectRatio: "1.42 / 1", minHeight: 380 }}>
      <div style={{ position: "absolute", inset: 24, color: "rgba(255,255,255,0.78)", fontSize: 11, lineHeight: 1.5 }}>
        {children}
      </div>
      <div className="stamp">{stamp}</div>
    </div>
  );
}

function PedimentoPreview({ op, hf }: { op: DemoOperation; hf: Set<string> }) {
  const hi = (k: string) => hf.has(k);
  const showValueHi = hi("valoradu") || hi("valorfact") || (op.status === "risk" && hf.size === 0);
  return (
    <PreviewFrame stamp={`PEDIMENTO · ${op.pedimento}`}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--hair)", paddingBottom: 6, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--ink-4)" }}>ADUANA · FORMATO A1</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: "white" }}>Pedimento de Importación</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--ink-3)" }}>
          {op.pedimento}<br/>Sección aduanera 470 · CDMX
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
        <PDField label="Importador" value="Industrias Cardelio S.A. de C.V." />
        <PDField label="RFC" value="ICA960314-9X2" mono />
        <PDField label="Agente aduanal" value={op.brokerage} />
        <PDField label="Tipo de operación" value="Importación definitiva (A1)" />
        <PDField label="INCOTERM" value={op.incoterm} />
        <PDField label="Medio de transporte" value={op.mode} />
        <PDField label="Origen" value={op.origin} />
        <PDField label="Destino" value={op.destination} />
        <PDField label="ETA" value={op.eta} />
      </div>
      <div style={{ border: "1px dashed var(--hair-2)", borderRadius: 6, padding: 10, marginTop: 6 }}>
        <div style={{ fontSize: 9, color: "var(--ink-4)", letterSpacing: "0.1em", marginBottom: 4 }}>PARTIDA 1</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          <PDField label="Fracción" value={op.hsBucket} mono highlight={hi("fracarancel")} />
          <PDField label="UMC" value="6 · Kg" mono />
          <PDField label="Cantidad" value="4,742" mono />
          <PDField label="Valor aduana"
            value={op.status === "risk" ? "$178,920.00 USD" : `$${op.value.toLocaleString(undefined,{minimumFractionDigits:2})} ${op.currency}`}
            mono highlight={showValueHi}
          />
        </div>
      </div>
    </PreviewFrame>
  );
}

function InvoicePreview({ op, hf }: { op: DemoOperation; hf: Set<string> }) {
  const hi = (k: string) => hf.has(k);
  const totalHi = hi("valorfact") || hi("valoradu") || (op.status === "risk" && hf.size === 0);
  return (
    <PreviewFrame stamp="COMMERCIAL INVOICE">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: "white" }}>{op.supplierShort}</div>
          <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{op.origin}</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--ink-3)" }}>
          INV-LMT-44218<br/>Issued · {op.eta}
        </div>
      </div>
      <div style={{ height: 1, background: "var(--hair)", margin: "10px 0" }} />
      <div style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.1em", marginBottom: 4 }}>BILL TO</div>
      <div style={{ fontSize: 12, color: "white" }}>Industrias Cardelio S.A. de C.V.</div>
      <div style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 14 }}>Av. Insurgentes Sur 1602, CDMX · MX</div>
      <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--hair)", color: "var(--ink-4)" }}>
            <th style={{ textAlign: "left", padding: "4px 0", fontWeight: 500 }}>Item</th>
            <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 500 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 500 }}>Unit</th>
            <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 500 }}>Total</th>
          </tr>
        </thead>
        <tbody style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <tr><td>SMD LED driver module 24V</td><td style={{ textAlign: "right" }}>2,400</td><td style={{ textAlign: "right" }}>$42.10</td><td style={{ textAlign: "right" }}>$101,040.00</td></tr>
          <tr><td>Heatsink alum. 80x80mm</td><td style={{ textAlign: "right" }}>1,800</td><td style={{ textAlign: "right" }}>$22.50</td><td style={{ textAlign: "right" }}>$40,500.00</td></tr>
          <tr><td>Optical lens 120°</td><td style={{ textAlign: "right" }}>3,800</td><td style={{ textAlign: "right" }}>$11.24</td><td style={{ textAlign: "right" }}>$42,710.00</td></tr>
        </tbody>
      </table>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          background: totalHi ? "oklch(0.70 0.16 25 / 0.12)" : "transparent",
          border: totalHi ? "1px solid oklch(0.70 0.16 25 / 0.5)" : "1px solid var(--hair)",
          borderRadius: 6, padding: "6px 12px",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "white",
          transition: "all .25s ease",
        }}>
          TOTAL · ${op.value.toLocaleString(undefined,{minimumFractionDigits:2})} {op.currency}
          {totalHi && <div style={{ fontSize: 10, color: "oklch(0.86 0.10 25)" }}>⚠ Δ vs. pedimento valor en aduana</div>}
        </div>
      </div>
    </PreviewFrame>
  );
}

function BLPreview({ op, hf }: { op: DemoOperation; hf: Set<string> }) {
  const hi = (k: string) => hf.has(k);
  const weightHi = hi("peso") || (op.status === "risk" && hf.size === 0);
  return (
    <PreviewFrame stamp="BILL OF LADING">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: "white" }}>MAERSK LINE</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--ink-3)", textAlign: "right" }}>
          MAEU-7741229<br/>Vessel: SAN AGUSTÍN · V.2026/14
        </div>
      </div>
      <div style={{ height: 1, background: "var(--hair)", margin: "10px 0" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <PDField label="Shipper" value={op.supplier} />
        <PDField label="Consignee" value="Industrias Cardelio S.A. de C.V." />
        <PDField label="Port of loading" value={op.origin} />
        <PDField label="Port of discharge" value="Manzanillo, MX" />
        <PDField label="Vessel" value="SAN AGUSTÍN V.2026/14" />
        <PDField label="ETA" value={op.eta} />
        <PDField label="Container" value="MSKU 778 4321 1" mono />
        <PDField label="Seal" value="ML 4421 88" mono />
      </div>
      <div style={{ marginTop: 12, padding: 10, borderRadius: 6, border: "1px dashed var(--hair-2)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        <PDField label="Pkgs" value="120 cartons" />
        <PDField label="Gross weight" value="4,860 kg" highlight={weightHi} />
        <PDField label="Net weight" value="4,612 kg" />
        <PDField label="CBM" value="14.2" />
      </div>
    </PreviewFrame>
  );
}

function PackingPreview({ op, hf }: { op: DemoOperation; hf: Set<string> }) {
  const hi = (k: string) => hf.has(k);
  const weightHi = hi("peso") || (op.status === "risk" && hf.size === 0);
  return (
    <PreviewFrame stamp="PACKING LIST">
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: "white", marginBottom: 8 }}>Packing List PL-LMT-44218</div>
      <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--hair)", color: "var(--ink-4)" }}>
            <th style={{ textAlign: "left", padding: "4px 0", fontWeight: 500 }}>Carton</th>
            <th style={{ textAlign: "left", padding: "4px 0", fontWeight: 500 }}>Contents</th>
            <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 500 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "4px 0", fontWeight: 500 }}>Gross kg</th>
          </tr>
        </thead>
        <tbody style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              <td>C-{101 + i}</td>
              <td>SMD LED driver / Heatsink mix</td>
              <td style={{ textAlign: "right" }}>{(220 + i * 40).toLocaleString()}</td>
              <td style={{ textAlign: "right" }}>{540 + i * 40}.0</td>
            </tr>
          ))}
          <tr style={{
            borderTop: "1px solid var(--hair)", color: "white", fontWeight: 600,
            background: weightHi ? "oklch(0.70 0.16 25 / 0.12)" : undefined,
          }}>
            <td colSpan={2} style={{ paddingTop: 6 }}>TOTAL</td>
            <td style={{ textAlign: "right", paddingTop: 6 }}>15,840</td>
            <td style={{ textAlign: "right", paddingTop: 6, color: weightHi ? "oklch(0.86 0.10 25)" : "white" }}>4,742</td>
          </tr>
        </tbody>
      </table>
    </PreviewFrame>
  );
}

function GenericDocPreview({ kind, op }: { kind: string; op: DemoOperation }) {
  return (
    <PreviewFrame stamp={kind.toUpperCase()}>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: "white", marginBottom: 8 }}>{kind}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        <PDField label="Document ID" value={`${kind.replace(/\s/g,"").toUpperCase()}-${op.id.slice(-6)}`} mono />
        <PDField label="Issued" value={op.eta} />
        <PDField label="Operation" value={op.id} mono />
        <PDField label="Status" value="Verified" />
      </div>
      <div style={{ marginTop: 14, padding: 12, borderRadius: 6, background: "rgba(255,255,255,0.02)", color: "var(--ink-3)", fontSize: 11, lineHeight: 1.6 }}>
        Document classified by Nextport AI with confidence 99.2%. All required fields extracted and cross-validated against companion documents in the operation expediente.
      </div>
    </PreviewFrame>
  );
}

function DocPreview({ kind, op, highlightedFields }: { kind: string; op: DemoOperation; highlightedFields: Set<string> }) {
  const hf = highlightedFields;
  if (kind === "Pedimento A1") return <PedimentoPreview op={op} hf={hf} />;
  if (kind === "Invoice")      return <InvoicePreview op={op} hf={hf} />;
  if (kind === "BL")           return <BLPreview op={op} hf={hf} />;
  if (kind === "Packing List") return <PackingPreview op={op} hf={hf} />;
  return <GenericDocPreview kind={kind} op={op} />;
}

function academyRecommendation(status: DemoOperation["status"]): { id: string; titleKey: TranslationKey } {
  if (status === "risk") return { id: "11", titleKey: "lessonValueDiscrepancyExceptions" };
  if (status === "review") return { id: "06", titleKey: "lessonCrossValidationExceptions" };
  return { id: "12", titleKey: "lessonHumanLoopApproval" };
}

/* ── Main component ─────────────────────────────────────── */
interface OperationDetailProps {
  op: DemoOperation;
}

export function OperationDetail({ op }: OperationDetailProps) {
  const { lang } = useLang();
  const [activeDoc, setActiveDoc] = useState(0);
  const [decision, setDecision] = useState<string | null>(null);
  const [focusedFlag, setFocusedFlag] = useState<number | null>(null);

  const focused = focusedFlag !== null ? op.flags[focusedFlag] : null;
  const highlightedFields = new Set<string>(focused ? focused.fields : []);
  const highlightedDocs   = new Set<string>(focused ? focused.docs : []);

  const currentDoc = op.docs[activeDoc] ?? op.docs[0];
  const academyLesson = academyRecommendation(op.status);

  // When exception is clicked, jump to related doc
  useEffect(() => {
    if (focused?.docs?.length) {
      const idx = op.docs.indexOf(focused.docs[0]);
      if (idx >= 0) setActiveDoc(idx);
    }
  }, [focusedFlag]);

  // Computed extracted fields
  const { left: fieldsLeft, right: fieldsRight } = useMemo(() => {
    const valueMismatch = op.status === "risk" && op.flags.some((f) => f.title.includes("Valor"));
    const weightMismatch = op.status === "risk" && op.flags.some((f) => f.title.includes("Peso"));
    const left = [
      { k: "pedimento",    label: "Pedimento",            value: op.pedimento, mono: true, status: "ok" as const },
      { k: "tipo",         label: "Tipo de operación",    value: "Importación definitiva (A1)", status: "ok" as const },
      { k: "agente",       label: "Agente aduanal",       value: op.brokerage, status: "ok" as const },
      { k: "fracarancel",  label: "Fracción arancelaria", value: `${op.hsBucket} · NICO 00`, mono: true, status: op.status === "risk" ? "warn" as const : "ok" as const },
      { k: "incoterm",     label: "INCOTERM",             value: `${op.incoterm} · ${op.origin}`, status: "ok" as const },
      { k: "transporte",   label: "Medio de transporte",  value: op.mode, status: "ok" as const },
      { k: "peso",         label: "Peso bruto",           value: weightMismatch ? "4,860 kg / 4,742 kg" : "4,742 kg", status: weightMismatch ? "warn" as const : "ok" as const, note: weightMismatch ? "BL ≠ Packing" : null },
    ];
    const right = [
      { k: "valorfact",  label: "Valor factura",       value: `$${op.value.toLocaleString(undefined,{minimumFractionDigits:2})} ${op.currency}`, mono: true, status: valueMismatch ? "risk" as const : "ok" as const },
      { k: "valoradu",   label: "Valor en aduana",     value: valueMismatch ? "$178,920.00 USD" : `$${op.value.toLocaleString(undefined,{minimumFractionDigits:2})} ${op.currency}`, mono: true, status: valueMismatch ? "risk" as const : "ok" as const, note: valueMismatch ? "Δ −$5,330 vs invoice" : null },
      { k: "iva",        label: "IVA (16%)",           value: `$${(op.value * 0.16).toLocaleString(undefined,{maximumFractionDigits:2})} MXN eq.`, mono: true, status: "ok" as const },
      { k: "igi",        label: "IGI / arancel",       value: op.status === "risk" ? "$2,684.00 USD" : "$0.00 USD (TLCAN)", mono: true, status: "ok" as const },
      { k: "naviera",    label: "Naviera / línea",     value: op.mode.startsWith("Ocean") ? "Maersk · MAEU-7741229" : "USA Truck · MX-44218", mono: true, status: "ok" as const },
      { k: "bl",         label: "BL / Guía",           value: op.mode.startsWith("Ocean") ? "MAEU-7741229" : "USTR-2026-44218", mono: true, status: "ok" as const },
    ];
    return { left, right };
  }, [op.id]);

  const statusChipKind = op.status === "risk" ? "risk" : op.status === "review" ? "review" : "ok";
  const statusLabel = op.status === "risk" ? t("atRisk", lang) : op.status === "review" ? t("needsReview", lang) : t("statusReady", lang);

  return (
    <div className="px-8 py-7">
      {/* Back */}
      <Link href="/console/operations" className="flex items-center gap-1.5 mb-4 text-[12px] hover:opacity-100 transition-opacity" style={{ color: "var(--ink-3)" }}>
        <Icon name="arrow_left" size={13} />
        {lang === "es" ? "Volver a bandeja" : lang === "zh" ? "返回收件箱" : "Back to inbox"}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[12.5px]" style={{ color: "var(--ink-3)" }}>{op.id}</span>
            <Chip kind={statusChipKind}>{statusLabel}</Chip>
            <Chip kind="brand">{op.mode}</Chip>
            <Chip kind="neutral">{op.incoterm}</Chip>
          </div>
          <h1 className="font-display text-[28px] leading-tight mb-1.5" style={{ color: "white" }}>{op.supplier}</h1>
          <div className="flex items-center gap-3 text-[12.5px]" style={{ color: "var(--ink-3)" }}>
            <span>{op.origin} <span style={{ color: "var(--ink-4)" }}>→</span> {op.destination}</span>
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--ink-4)" }} />
            <span>ETA <span className="tabular" style={{ color: "white" }}>{op.eta}</span>{" "}
              <span style={{ color: op.etaDelta.startsWith("+") ? "var(--warn)" : "var(--ink-3)" }}>{op.etaDelta}</span>
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--ink-4)" }} />
            <span>Pedimento <span className="font-mono" style={{ color: "white" }}>{op.pedimento}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium" style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.4)", color: "var(--brand)" }}>
            {op.owner.initials}
          </div>
          <div className="text-right mr-1">
            <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{t("owner", lang)}</div>
            <div className="text-[12px]" style={{ color: "white" }}>{op.owner.name}</div>
          </div>
          <button className="btn btn-sm"><Icon name="history" size={13} /> {lang === "es" ? "Trazabilidad" : lang === "zh" ? "审计轨迹" : "Audit trail"}</button>
          <button className="btn btn-sm"><Icon name="link" size={13} /> {lang === "es" ? "Compartir" : lang === "zh" ? "分享" : "Share"}</button>
        </div>
      </div>

      {/* Audit banner */}
      <div className="glass-panel-tight px-4 py-2.5 mb-5 flex items-center gap-3 text-[12px]" style={{ color: "var(--ink-2)" }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.3)" }}>
          <Icon name="shield" size={11} style={{ color: "var(--brand)" }} />
        </div>
        <div className="flex-1">{lang === "es" ? "Cada extracción, excepción y aprobación de IA se registra con marca de tiempo y documento fuente." : lang === "zh" ? "每次AI提取、异常和审批均记录时间戳和来源文件。" : "Every AI extraction, exception and approval is logged with timestamp and source document."}</div>
        <div className="flex items-center gap-2 font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>
          <span>Trail · {op.id}</span>
          <span>SHA 7f3c…b29a</span>
        </div>
      </div>

      {/* 3-column workspace */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "260px 1fr 360px" }}>

        {/* LEFT: documents + activity */}
        <aside className="glass-panel p-4">
          <SectionTitle icon="file">{lang === "es" ? "Documentos encontrados" : lang === "zh" ? "已找到文件" : "Documents found"}</SectionTitle>
          <div className="text-[11px] mb-3" style={{ color: "var(--ink-4)" }}>
            <span className="tabular" style={{ color: "rgba(255,255,255,0.75)" }}>{op.docCount}</span>
            {lang === "es" ? " de " : lang === "zh" ? " / " : " of "}
            <span className="tabular">{op.docsExpected}</span>
            {lang === "es" ? " esperados · clasificados por IA" : lang === "zh" ? " 预期 · AI分类" : " expected · classified by AI"}
          </div>
          <div className="space-y-1.5">
            {op.docs.map((d, i) => (
              <DocChip
                key={d}
                doc={d}
                active={i === activeDoc}
                highlighted={highlightedDocs.has(d)}
                hasFlag={i === 0 && op.status === "risk"}
                onClick={() => setActiveDoc(i)}
              />
            ))}
            {Array.from({ length: Math.max(0, op.docsExpected - op.docCount) }).map((_, i) => (
              <div key={`missing-${i}`} className="doc-chip" style={{ borderStyle: "dashed", opacity: 0.7 }}>
                <div className="ico" style={{ background: "rgba(255,255,255,0.01)", borderStyle: "dashed" }} />
                <div className="flex-1">
                  <div className="text-[12.5px]" style={{ color: "var(--ink-3)" }}>{lang === "es" ? "Documento faltante" : lang === "zh" ? "缺少文件" : "Missing document"}</div>
                  <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{lang === "es" ? "Esperado — solicitar al agente" : lang === "zh" ? "预期 — 向报关行索取" : "Expected — request from broker"}</div>
                </div>
                <Icon name="alert" size={14} style={{ color: "var(--warn)" }} />
              </div>
            ))}
          </div>

          <div className="divider my-4" />
          <SectionTitle icon="history">{t("activityLabel", lang)}</SectionTitle>
          <div className="space-y-2.5 text-[12px]">
            {op.timeline.map((e, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="font-mono text-[10.5px] mt-0.5 w-[60px] flex-shrink-0" style={{ color: "var(--ink-4)" }}>{e.t}</span>
                <span className="leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>{e.e}</span>
              </div>
            ))}
            {op.timeline.length === 0 && (
              <div className="text-[11.5px]" style={{ color: "var(--ink-4)" }}>{lang === "es" ? "Sin actividad aún." : lang === "zh" ? "暂无活动。" : "No activity yet."}</div>
            )}
          </div>
        </aside>

        {/* CENTER: doc preview + extracted fields */}
        <main className="space-y-4 min-w-0">
          {/* Preview header */}
          <div className="glass-panel p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--hair)" }}>
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name="file" size={14} style={{ opacity: 0.7, flexShrink: 0 }} />
                <div className="text-[13px] truncate" style={{ color: "white" }}>{currentDoc}</div>
                <Chip kind="brand">AI classified · 99.2%</Chip>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="btn btn-sm btn-ghost"><Icon name="eye" size={13} /> Preview</button>
                <button className="btn btn-sm btn-ghost"><Icon name="download" size={13} /></button>
              </div>
            </div>
            <div className="p-4">
              <DocPreview kind={currentDoc} op={op} highlightedFields={highlightedFields} />
            </div>
          </div>

          {/* Extracted fields */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle icon="sparkle">{lang === "es" ? "Campos extraídos" : lang === "zh" ? "提取的字段" : "Extracted fields"}</SectionTitle>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--ink-4)" }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--ok)" }} />
                {lang === "es" ? `Validado cruzado contra los ${op.docCount} documentos` : lang === "zh" ? `已与全部 ${op.docCount} 份文件交叉验证` : `Cross-validated against all ${op.docCount} documents`}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6">
              <div>
                {fieldsLeft.map((f) => (
                  <FieldRow key={f.k} label={f.label} value={f.value} mono={f.mono} status={f.status} note={f.note} highlighted={highlightedFields.has(f.k)} />
                ))}
              </div>
              <div>
                {fieldsRight.map((f) => (
                  <FieldRow key={f.k} label={f.label} value={f.value} mono={f.mono} status={f.status} note={(f as any).note} highlighted={highlightedFields.has(f.k)} />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: exceptions + NBA + summary + approval */}
        <aside className="space-y-4">
          {/* Exceptions */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle icon="alert">{lang === "es" ? "Excepciones detectadas" : lang === "zh" ? "检测到的异常" : "Exceptions detected"}</SectionTitle>
              <div className="flex items-center gap-2">
                {focusedFlag !== null && (
                  <button className="text-[10.5px] hover:opacity-100 transition-opacity" style={{ color: "var(--ink-3)" }} onClick={() => setFocusedFlag(null)}>{lang === "es" ? "Limpiar foco" : lang === "zh" ? "清除焦点" : "Clear focus"}</button>
                )}
                <span className="text-[11px] tabular" style={{ color: "var(--ink-4)" }}>{op.flags.length}</span>
              </div>
            </div>
            {op.flags.length === 0 ? (
              <div className="text-[12.5px] flex items-center gap-2 py-2" style={{ color: "var(--ink-3)" }}>
                <Icon name="check" size={14} style={{ color: "var(--ok)" }} /> {lang === "es" ? "Sin excepciones detectadas." : lang === "zh" ? "未检测到异常。" : "No exceptions detected."}
              </div>
            ) : (
              <div className="space-y-2">
                {op.flags.map((f, i) => (
                  <ExceptionCard
                    key={i}
                    flag={f}
                    active={focusedFlag === i}
                    onClick={() => setFocusedFlag(focusedFlag === i ? null : i)}
                  />
                ))}
              </div>
            )}
            {op.flags.length > 0 && (
              <div className="mt-3 pt-3 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: "var(--hair)", color: "var(--ink-4)" }}>
                <Icon name="info" size={11} /> {lang === "es" ? "Haz clic en una excepción para resaltar su documento y campo fuente." : lang === "zh" ? "点击异常以高亮显示其来源文件和字段。" : "Click an exception to highlight its source document and field."}
              </div>
            )}
          </div>

          {/* Next best action */}
          {op.recommendedAction && <NextBestAction action={op.recommendedAction} />}

          {/* Academy link */}
          {op.status !== "ready" && (
            <Link href={`/console/academy/${academyLesson.id}`} className="glass-panel p-3 w-full flex items-center gap-3 transition-colors hover:bg-white/[0.03]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.4)" }}>
                <Icon name="sparkle" size={12} style={{ color: "var(--brand)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px]" style={{ color: "white" }}>{t("openAcademy", lang)} · {t(academyLesson.titleKey, lang)}</div>
                <div className="text-[10.5px]" style={{ color: "var(--ink-3)" }}>{t("relatedAcademyModule", lang)} {academyLesson.id}</div>
              </div>
              <Icon name="arrow_right" size={12} style={{ opacity: 0.6 }} />
            </Link>
          )}

          {/* AI summary */}
          <div className="glass-panel p-4" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))" }}>
            <div className="flex items-center justify-between mb-3">
              <SectionTitle icon="sparkle">{t("aiSummary", lang)}</SectionTitle>
              <span className="text-[10.5px] font-mono" style={{ color: "var(--ink-4)" }}>v 3.2 · synthesized 09:18</span>
            </div>
            <p className="text-[12.8px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{op.summary}</p>
            <div className="mt-3 pt-3 border-t flex items-center gap-2 text-[11px]" style={{ borderColor: "var(--hair)", color: "var(--ink-4)" }}>
              <Icon name="info" size={11} /> {lang === "es" ? "Generado por IA · siempre verifica contra documentos fuente." : lang === "zh" ? "由AI生成 · 请始终对照源文件验证。" : "Generated by AI · always verify against source documents."}
            </div>
          </div>

          {/* Human in the loop — sticky approval rail */}
          <div className="glass-panel p-4" style={{ position: "sticky", top: 16 }}>
            <SectionTitle icon="shield">{lang === "es" ? "Humano en el proceso" : lang === "zh" ? "人工参与" : "Human in the loop"}</SectionTitle>
            <div className="text-[12px] mb-3" style={{ color: "var(--ink-3)" }}>{lang === "es" ? "Requerido antes de entrega a ERP / aduana." : lang === "zh" ? "ERP/海关移交前必须完成。" : "Required before ERP / customs handoff."}</div>
            <ApprovalRow label={lang === "es" ? "Revisión de cumplimiento" : lang === "zh" ? "合规审查" : "Compliance review"} who="Mariana López" status={op.status === "ready" ? "done" : "pending"} />
            <ApprovalRow label={lang === "es" ? "Aprobación del manager" : lang === "zh" ? "经理审批" : "Manager sign-off"} who="Sofía Galván" status={op.status === "ready" ? "queued" : "blocked"} />
            <div className="space-y-2 mt-4">
              {decision === null ? (
                <>
                  <button
                    className="btn w-full justify-center"
                    style={op.status === "ready"
                      ? { background: "linear-gradient(180deg, oklch(0.86 0.13 155), oklch(0.62 0.13 155))", color: "#0A0D12", borderColor: "transparent" }
                      : { opacity: 0.45, cursor: "not-allowed" }}
                    disabled={op.status !== "ready"}
                    onClick={() => setDecision("approved")}
                  >
                    <Icon name="check" size={14} /> {lang === "es" ? "Aprobar y liberar" : lang === "zh" ? "批准并放行" : "Approve & release"}
                  </button>
                  <button className="btn w-full justify-center" onClick={() => setDecision("review")}>
                    <Icon name="user" size={13} /> {lang === "es" ? "Enviar a revisión" : lang === "zh" ? "发送审查" : "Send for review"}
                  </button>
                  <button className="btn btn-danger w-full justify-center" onClick={() => setDecision("held")}>
                    <Icon name="flag" size={13} /> {lang === "es" ? "Poner en espera" : lang === "zh" ? "暂停运营" : "Hold operation"}
                  </button>
                </>
              ) : (
                <div className="glass-panel-tight p-3 flex items-center gap-2.5">
                  <Icon name="check" size={14} style={{ color: "var(--ok)" }} />
                  <div className="flex-1">
                    <div className="text-[12px]" style={{ color: "white" }}>{lang === "es" ? "Decisión registrada" : lang === "zh" ? "决策已记录" : "Decision recorded"}</div>
                    <div className="text-[11px] capitalize" style={{ color: "var(--ink-4)" }}>{decision} · {lang === "es" ? "registrado en trazabilidad" : lang === "zh" ? "已记录在审计轨迹" : "logged in audit trail"}</div>
                  </div>
                  <button className="btn btn-sm btn-ghost" onClick={() => setDecision(null)}>{lang === "es" ? "Deshacer" : lang === "zh" ? "撤销" : "Undo"}</button>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 text-[10.5px] font-mono border-t flex items-center justify-between" style={{ borderColor: "var(--hair)", color: "var(--ink-4)" }}>
              <span>SHA256 · 7f3c…b29a</span>
              <span>SOC 2 ✓</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
