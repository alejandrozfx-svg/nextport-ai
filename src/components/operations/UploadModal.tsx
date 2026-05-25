"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import { sampleDocuments } from "@/lib/pipeline-data";
import { AppIcon as Icon } from "@/components/ui/AppIcon";
import { Modal } from "@/components/ui/Modal";

export function UploadModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [files, setFiles] = useState<Array<{
    name: string;
    type: string;
    size: string;
    href: string;
    confidence: string;
    progress: number;
    classified: boolean;
    extracted: number;
  }>>([]);

  function startScan() {
    setFiles(sampleDocuments.map((d) => ({
      name: d.name,
      type: d.type,
      size: d.size,
      href: d.href,
      confidence: d.confidence,
      progress: 0,
      classified: false,
      extracted: 0,
    })));
    setPhase("scanning");
    animateScan(sampleDocuments.length);
  }

  function animateScan(count: number) {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      setFiles((prev) => prev.map((file, index) => {
        const offset = index * 0.35;
        const progress = Math.max(0, Math.min(1, (elapsed - offset) / 1.6));
        const extracted = Math.max(0, Math.min(1, (elapsed - offset - 1.0) / 1.5));
        return {
          ...file,
          progress,
          classified: progress >= 1,
          extracted: Math.floor(extracted * (index === 0 ? 6 : 24)),
        };
      }));
      if (elapsed < count * 0.35 + 3.0) {
        requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    }
    requestAnimationFrame(tick);
  }

  return (
    <Modal onClose={onClose}>
        <div className="flex items-start justify-between gap-3 border-b px-4 pb-4 pt-5 sm:items-center sm:px-6" style={{ borderColor: "var(--hair)" }}>
          <div className="flex items-center gap-2.5">
            <Icon name="inbox" size={16} />
            <div>
              <div className="text-[15px]" style={{ color: "white" }}>
                {lang === "es" ? "Detectar documentos de importación" : lang === "zh" ? "检测进口文件" : "Detect import documents"}
              </div>
              <div className="text-[12px]" style={{ color: "var(--ink-4)" }}>
                {lang === "es" ? "Simula recepción por correo o carga manual, luego clasifica, extrae, valida y pone en cola para revisión humana." : lang === "zh" ? "模拟邮件或手动上传接收，然后分类、提取、验证并排队等待人工审核。" : "Simulate email or upload intake, then classify, extract, validate and queue human review."}
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>

        <div className="p-4 sm:p-6">
          {phase === "idle" && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  [lang === "es" ? "Bandeja Gmail" : lang === "zh" ? "Gmail收件箱" : "Gmail inbox", lang === "es" ? "Correo del agente con 5 PDFs adjuntos" : lang === "zh" ? "报关行邮件附带5份PDF" : "Broker email with 5 attached PDFs", lang === "es" ? "Conectado" : lang === "zh" ? "已连接" : "Connected"],
                  [lang === "es" ? "Carga manual" : lang === "zh" ? "手动上传" : "Manual upload", lang === "es" ? "Suelta los PDFs del paquete de ejemplo" : lang === "zh" ? "拖放示例文件包中的PDF" : "Drop PDFs from the sample document pack", lang === "es" ? "Listo" : lang === "zh" ? "就绪" : "Ready"],
                  [lang === "es" ? "Carpeta del agente" : lang === "zh" ? "报关行文件夹" : "Broker folder", lang === "es" ? "Drive / SharePoint compartido" : lang === "zh" ? "共享 Drive / SharePoint" : "Shared Drive / SharePoint watcher", lang === "es" ? "Configuración pendiente" : lang === "zh" ? "待配置" : "Pending setup"],
                ].map(([label, value, status]) => (
                  <div key={label} className="glass-panel-tight p-3">
                    <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{label}</div>
                    <div className="text-[12.5px] leading-snug mt-1" style={{ color: "white" }}>{value}</div>
                    <div className="text-[10.5px] mt-2" style={{ color: status.includes("ending") || status.includes("pendiente") || status.includes("待") ? "var(--warn)" : "var(--ok)" }}>{status}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border-2 border-dashed p-5 text-center sm:p-10" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.015)" }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center liquid-glass">
                  <Icon name="upload" size={18} />
                </div>
                <div className="text-[14px] mb-1.5" style={{ color: "white" }}>
                  {lang === "es" ? "Empieza con detección por correo o usa el paquete de demo" : lang === "zh" ? "从邮件检测开始或使用示例文件包" : "Start from email detection or use the dummy document pack"}
                </div>
                <div className="text-[12px] mb-4" style={{ color: "var(--ink-4)" }}>
                  {lang === "es" ? "PDF, XML, ZIP o JPG hasta 50 MB. Este demo usa los PDFs de cumplimiento aduanero incluidos." : lang === "zh" ? "PDF、XML、ZIP或JPG最大50 MB。本演示使用包含的贸易合规PDF。" : "PDF, XML, ZIP or JPG up to 50 MB. This demo uses the provided trade compliance PDFs."}
                </div>
                <button className="btn btn-primary btn-sm mx-auto" onClick={startScan}>
                  {lang === "es" ? "Usar paquete de muestra" : lang === "zh" ? "使用示例文件包" : "Use sample document pack"}
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
                  {phase === "done"
                    ? (lang === "es" ? "Validación lista para revisión humana" : lang === "zh" ? "验证已准备好进行人工审核" : "Validation ready for human review")
                    : (lang === "es" ? "Detectando, clasificando y extrayendo..." : lang === "zh" ? "检测、分类和提取中..." : "Detecting, classifying and extracting...")}
                </div>
                <div className="text-[11px] font-mono tabular" style={{ color: "var(--ink-4)" }}>
                  {files.filter((f) => f.classified).length} / {files.length} {lang === "es" ? "clasificados" : lang === "zh" ? "已分类" : "classified"}
                </div>
              </div>

              <div className="space-y-1.5">
                {files.map((f) => (
                  <div key={f.name} className="glass-panel-tight flex flex-col items-stretch gap-3 px-3 py-2.5 sm:flex-row sm:items-center">
                    {/* PDF thumb with active scan-line during processing (ADR-0002 B1) */}
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noreferrer"
                      className="relative w-7 h-9 rounded-[3px] border flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{
                        background: "linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))",
                        borderColor: "var(--hair-2)",
                        color: "var(--brand)",
                      }}
                    >
                      <Icon name="file" size={13} />
                      {!f.classified && f.progress > 0 && (
                        <span
                          className="scan-line absolute left-0 right-0 h-px"
                          style={{
                            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                            boxShadow: "0 0 6px var(--accent)",
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </a>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <a href={f.href} target="_blank" rel="noreferrer" className="text-[12.5px] truncate flex-1 hover:underline" style={{ color: "white" }}>{f.name}</a>
                        <div className="font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>{f.size}</div>
                      </div>
                      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="progress flex-1"><span style={{ width: `${f.progress * 100}%` }} /></div>
                        <div className="flex items-center justify-start gap-1.5 sm:min-w-[175px] sm:justify-end">
                          {f.classified ? (
                            <>
                              <span className="chip chip-brand"><span className="dot" />{f.type}</span>
                              <span className="text-[10.5px] font-mono tabular" style={{ color: "var(--ink-4)" }}>{f.confidence} · {f.extracted} {lang === "es" ? "campos" : lang === "zh" ? "字段" : "fields"}</span>
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--warn-soft)", border: "1px solid oklch(0.78 0.14 70 / 0.4)", color: "var(--warn)" }}>
                    <Icon name="alert" size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px]" style={{ color: "white" }}>
                      {lang === "es" ? "Operación NP-2026-001848 creada o actualizada con la evidencia recibida." : lang === "zh" ? "运营 NP-2026-001848 已从邮件/上传证据创建或更新。" : "Operation NP-2026-001848 created or updated from email/upload evidence."}
                    </div>
                    <div className="text-[11.5px]" style={{ color: "var(--ink-4)" }}>
                      {lang === "es" ? "2 excepciones detectadas: discrepancia en contenedor BL y origen pendiente. Esperando revisión humana." : lang === "zh" ? "检测到 2 个异常：BL 集装箱不匹配，原产地需支持。等待人工审核。" : "2 exceptions detected: BL container mismatch and origin support needed. Awaiting human review."}
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={onClose}>
                    {lang === "es" ? "Volver a bandeja" : lang === "zh" ? "返回收件箱" : "Back to inbox"} <Icon name="arrow_right" size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
    </Modal>
  );
}
