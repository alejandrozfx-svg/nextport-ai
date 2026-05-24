"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { DEMO_OPERATIONS } from "@/lib/demo-data";
import { sampleDocuments, workflowSteps } from "@/lib/pipeline-data";

/* ── Inline icons (matches the rest of the console) ──────── */
function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const s = { width: size, height: size, flexShrink: 0 as const };
  const icons: Record<string, ReactElement> = {
    upload:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    mail:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
    file:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></svg>,
    database:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>,
    shield:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
    eye:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
    zap:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    inbox:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
    arrow_right: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  };
  return icons[name] ?? <svg style={s} />;
}

function toneColor(tone: "ok" | "brand" | "warn" | "risk") {
  return {
    ok: "var(--ok)",
    brand: "var(--brand)",
    warn: "var(--warn)",
    risk: "var(--risk)",
  }[tone];
}

/* ── Localized labels per workflow step ───────────────────── */
function localizedStep(step: (typeof workflowSteps)[number], lang: "en" | "es" | "zh") {
  if (lang === "es") {
    const map: Record<string, { title: string; summary: string; status: string }> = {
      detected:   { title: "Email o carga detectada",      summary: "Un usuario deja PDFs o conecta Gmail, Outlook, Drive o buzones del agente.", status: "Disparador" },
      classified: { title: "Documentos clasificados",      summary: "La IA etiqueta factura, BL, packing list, pedimento, MVE y demás evidencia.", status: "Auto" },
      extracted:  { title: "Campos extraídos",             summary: "RFC, totales, fracción, origen, contenedores, cantidades, pesos y ETA se vuelven datos.", status: "Datos" },
      validated:  { title: "Validación cruzada",           summary: "Factura vs PO, BL vs packing list, MVE vs pedimento y revisiones de origen.", status: "2 excepciones" },
      review:     { title: "Revisión humana",              summary: "Un especialista revisa evidencia, resumen IA, excepciones y acciones recomendadas.", status: "Requerido" },
      handoff:    { title: "Entrega a ERP / agente",       summary: "Los datos aprobados se preparan para SAP, NetSuite, VUCEM, SAT o sistemas del agente.", status: "Listo tras aprobación" },
    };
    return map[step.key] ?? { title: step.title, summary: step.summary, status: step.status };
  }
  if (lang === "zh") {
    const map: Record<string, { title: string; summary: string; status: string }> = {
      detected:   { title: "检测到邮件或上传",          summary: "用户上传PDF或连接Gmail、Outlook、Drive或报关行邮箱。",        status: "触发器" },
      classified: { title: "文件已分类",                summary: "AI识别发票、提单、装箱单、报关单、MVE等证据。",                status: "自动" },
      extracted:  { title: "字段已提取",                summary: "RFC、总额、HS编码、原产地、集装箱、数量、重量、ETA成为数据。", status: "数据" },
      validated:  { title: "跨文件验证",                summary: "发票与采购单、提单与装箱单、MVE与报关单、原产地核对。",        status: "2 个异常" },
      review:     { title: "人工审查",                  summary: "专家审查证据、AI摘要、异常和建议操作。",                        status: "必需" },
      handoff:    { title: "ERP / 报关行移交",          summary: "已批准的数据为SAP、NetSuite、VUCEM、SAT或报关系统准备。",      status: "审批后就绪" },
    };
    return map[step.key] ?? { title: step.title, summary: step.summary, status: step.status };
  }
  return { title: step.title, summary: step.summary, status: step.status };
}

function EvidencePackLinks() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {sampleDocuments.map((doc) => (
        <a
          key={doc.name}
          href={doc.href}
          target="_blank"
          rel="noreferrer"
          className="glass-panel-tight px-2.5 py-2 transition-all hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-7 rounded-[4px] border flex items-center justify-center flex-shrink-0" style={{ borderColor: "var(--hair-2)", color: "var(--brand)", background: "rgba(255,255,255,0.04)" }}>
              <Icon name="file" size={12} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] truncate" style={{ color: "white" }}>{doc.label}</div>
              <div className="text-[10px] mt-0.5 truncate" style={{ color: "var(--ink-4)" }}>{doc.type}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function WorkflowRibbon({ lang }: { lang: "en" | "es" | "zh" }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {workflowSteps.map((step, index) => {
        const color = toneColor(step.statusTone);
        const loc = localizedStep(step, lang);
        return (
          <div key={step.key} className="glass-panel-tight p-3">
            <div className="flex items-start gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ color, background: `${color}18`, border: `1px solid ${color}55` }}
              >
                <Icon name={step.icon} size={15} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono" style={{ color: "var(--ink-4)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] rounded-full px-1.5 py-0.5 border" style={{ color, borderColor: `${color}66`, background: `${color}12` }}>
                    {loc.status}
                  </span>
                </div>
                <div className="text-[12px] font-medium mt-1 truncate" style={{ color: "white" }}>{loc.title}</div>
                <div className="text-[10.8px] leading-snug mt-0.5 line-clamp-2" style={{ color: "var(--ink-4)" }}>{loc.summary}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PipelinePage() {
  const { lang } = useLang();

  const counts = {
    all:    DEMO_OPERATIONS.length,
    risk:   DEMO_OPERATIONS.filter((o) => o.status === "risk").length,
    review: DEMO_OPERATIONS.filter((o) => o.status === "review").length,
    ready:  DEMO_OPERATIONS.filter((o) => o.status === "ready").length,
  };

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 md:px-8 md:py-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-1 gap-4">
        <div className="max-w-3xl">
          <h1 className="text-[22px] font-semibold" style={{ color: "white" }}>{t("pipelineHeader", lang)}</h1>
          <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ink-3)" }}>
            {t("pipelineSubtitle", lang)}
          </p>
        </div>
      </div>

      {/* Auto-injected operations summary (the 3 KPIs about pipeline output) */}
      <section className="glass-panel-tight p-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip chip-brand"><span className="dot" />{t("pipelineOutput", lang)}</span>
          </div>
          <h2 className="text-[17px] font-semibold" style={{ color: "white" }}>
            {lang === "es" ? "Salida del pipeline en este momento" : lang === "zh" ? "当前工作流输出" : "Pipeline output right now"}
          </h2>
          <p className="text-[12px] mt-1 max-w-3xl" style={{ color: "var(--ink-3)" }}>
            {lang === "es" ? "Estos son los registros que la IA detectó, clasificó y vinculó sin que un humano armara el expediente manualmente." : lang === "zh" ? "AI检测、分类并关联的记录，无需人工手动整理档案。" : "Records the AI detected, classified and linked without a human manually building the expediente."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full xl:w-auto xl:min-w-[420px]">
          {[
            { label: lang === "es" ? "Inyectadas"        : lang === "zh" ? "已注入"   : "Injected",            value: counts.all,                tone: "brand" as const },
            { label: lang === "es" ? "Necesita revisión" : lang === "zh" ? "需人工审核" : "Needs human review", value: counts.risk + counts.review, tone: "warn"  as const },
            { label: lang === "es" ? "Listas"            : lang === "zh" ? "已就绪"   : "Ready for handoff",   value: counts.ready,              tone: "ok"    as const },
          ].map((item) => {
            const color = toneColor(item.tone);
            return (
              <div key={item.label} className="rounded-lg border px-3 py-2" style={{ borderColor: `${color}55`, background: `${color}10` }}>
                <div className="text-[18px] font-semibold leading-none" style={{ color }}>{item.value}</div>
                <div className="text-[10.5px] mt-1" style={{ color: "var(--ink-4)" }}>{item.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The story: how operations enter + the 6-step workflow + evidence pack */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(360px,0.86fr)_minmax(520px,1.14fr)] gap-3">
        <div className="glass-panel p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="chip chip-brand"><span className="dot" />{lang === "es" ? "Disparador entrante" : lang === "zh" ? "进入触发器" : "Incoming trigger"}</span>
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-4)" }}>
              {lang === "es" ? "Historia del producto" : lang === "zh" ? "产品故事" : "Product story"}
            </span>
          </div>
          <h2 className="text-[19px] font-semibold" style={{ color: "white" }}>
            {lang === "es" ? "Nueva operación entrante" : lang === "zh" ? "新运营进入" : "New operation incoming"}
          </h2>
          <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: "var(--ink-3)" }}>
            {lang === "es" ? "Nextport observa correos del agente, carpetas compartidas y cargas manuales, luego convierte evidencia suelta en una operación lista para revisión." : lang === "zh" ? "Nextport监控报关行邮件、共享文件夹和手动上传，然后将零散证据转化为可审核的运营。" : "Nextport watches broker emails, shared folders and manual uploads, then turns loose evidence into a ready-to-review import operation."}
          </p>

          <div className="mt-4 space-y-2">
            {[
              {
                icon: "mail",
                label: lang === "es" ? "Correo del agente detectado" : lang === "zh" ? "已检测到报关行邮件" : "Broker email detected",
                value: lang === "es" ? "Fuente Gmail / Outlook coincide con datos de embarque" : lang === "zh" ? "Gmail/Outlook来源与运输数据匹配" : "Gmail / Outlook source matched shipment data",
                tone: "brand" as const,
              },
              {
                icon: "upload",
                label: lang === "es" ? "Paquete de documentos adjunto" : lang === "zh" ? "已附加文件包" : "Document pack attached",
                value: lang === "es" ? "6 PDFs: factura, BL, packing list, pedimento y MVE" : lang === "zh" ? "6份PDF：发票、提单、装箱单、报关单和MVE" : "6 PDFs: invoice, BL, packing list, pedimento and MVE",
                tone: "ok" as const,
              },
              {
                icon: "inbox",
                label: lang === "es" ? "Operación inyectada" : lang === "zh" ? "运营已注入" : "Operation injected",
                value: lang === "es" ? "Crea o actualiza NP-2026-001848 automáticamente" : lang === "zh" ? "自动创建或更新 NP-2026-001848" : "Creates or updates NP-2026-001848 automatically",
                tone: "warn" as const,
              },
            ].map((item) => {
              const color = toneColor(item.tone);
              return (
                <div key={item.label} className="glass-panel-tight p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ color, background: `${color}18`, border: `1px solid ${color}55` }}>
                    <Icon name={item.icon} size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium" style={{ color: "white" }}>{item.label}</div>
                    <div className="text-[11px] mt-0.5 truncate" style={{ color: "var(--ink-4)" }}>{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link href="/console/operations" className="btn btn-primary btn-sm">
              <Icon name="arrow_right" size={13} /> {t("pipelineSeeQueue", lang)}
            </Link>
            <Link href="/console/integrations" className="btn btn-sm">
              <Icon name="inbox" size={13} /> {lang === "es" ? "Conectar buzón" : lang === "zh" ? "连接收件箱" : "Connect inbox"}
            </Link>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="chip chip-ok"><span className="dot" />{lang === "es" ? "Auto-preparación" : lang === "zh" ? "自动准备" : "Auto-prep"}</span>
                <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-4)" }}>
                  {lang === "es" ? "La aprobación humana sigue al mando" : lang === "zh" ? "人工审批保持控制" : "Human approval stays in control"}
                </span>
              </div>
              <h2 className="text-[18px] font-semibold" style={{ color: "white" }}>
                {lang === "es" ? "De la evidencia a la cola de revisión" : lang === "zh" ? "从证据到审核队列" : "From evidence to review queue"}
              </h2>
              <p className="text-[12.5px] leading-relaxed mt-1 max-w-2xl" style={{ color: "var(--ink-3)" }}>
                {lang === "es" ? "El sistema hace el trabajo de preparación: clasifica, extrae, valida y explica. El equipo decide antes de la entrega a ERP o agente." : lang === "zh" ? "系统完成准备工作：分类、提取、验证和解释。团队在ERP或报关行移交前决策。" : "The system does the prep work: classify, extract, validate and explain. The team still decides before ERP or broker handoff."}
              </p>
            </div>
            <div className="text-[11px] font-mono tabular" style={{ color: "var(--ink-4)" }}>
              {sampleDocuments.length} {lang === "es" ? "archivos de evidencia" : lang === "zh" ? "证据文件" : "evidence files"}
            </div>
          </div>

          <div className="mt-4">
            <WorkflowRibbon lang={lang} />
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--hair)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12px] font-medium" style={{ color: "white" }}>
                {lang === "es" ? "Paquete de evidencia" : lang === "zh" ? "证据包" : "Evidence pack"}
              </div>
              <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>
                {lang === "es" ? "Haz clic en cualquier archivo para ver la fuente" : lang === "zh" ? "点击任何文件查看来源" : "Click any file to inspect the source"}
              </div>
            </div>
            <EvidencePackLinks />
          </div>
        </div>
      </section>
    </div>
  );
}
