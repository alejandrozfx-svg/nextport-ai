"use client";

/* Marketplace surface (D-006 Camino A revenue plays + D-007 honesty applied).
 * Showcases the 8 revenue features from Roadmap/revenue-roadmap-2026 with clear
 * status, pricing hint, and per-card link to the detail page where the user can
 * pick a billing cadence (monthly / annual / on-demand).
 *
 * Activation is honest: clicking a CTA toasts intent. Industry Pack "Activate"
 * also flips the workspace vertical (the only real product effect). Production
 * billing wiring (Stripe etc.) follows pilot — deferred deliberately.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter as FilterIcon, Sparkles } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { useToast } from "@/components/ui/ToastProvider";
import { useWorkspace } from "@/lib/workspace-context";
import { t, type TranslationKey } from "@/lib/i18n";
import { PageHeader, SectionCard } from "@/components/ui";
import {
  SECTIONS,
  type MarketplaceItem,
  type Status,
  type CtaKind,
} from "@/lib/marketplace-data";

const STATUS_META: Record<
  Status,
  { labelKey: TranslationKey; color: string; bg: string; border: string }
> = {
  available:   { labelKey: "marketplaceStatusAvailable",   color: "var(--ok)",    bg: "var(--ok-soft)",    border: "oklch(0.78 0.13 155 / 0.4)" },
  beta:        { labelKey: "marketplaceStatusBeta",        color: "var(--brand)", bg: "var(--brand-soft)", border: "oklch(0.78 0.09 235 / 0.4)" },
  comingQ3:    { labelKey: "marketplaceStatusComingQ3",    color: "var(--warn)",  bg: "var(--warn-soft)",  border: "oklch(0.78 0.14 70 / 0.4)"  },
  comingQ4:    { labelKey: "marketplaceStatusComingQ4",    color: "var(--warn)",  bg: "var(--warn-soft)",  border: "oklch(0.78 0.14 70 / 0.4)"  },
  comingLater: { labelKey: "marketplaceStatusComingLater", color: "var(--ink-3)", bg: "rgba(255,255,255,0.04)", border: "var(--hair-2)"          },
  pilot:       { labelKey: "marketplaceStatusPilot",       color: "var(--brand)", bg: "var(--brand-soft)", border: "oklch(0.78 0.09 235 / 0.4)" },
};

const CTA_META: Record<CtaKind, { labelKey: TranslationKey; tone: "ok" | "brand" | "warn" }> = {
  activate: { labelKey: "marketplaceCtaActivate", tone: "ok" },
  waitlist: { labelKey: "marketplaceCtaWaitlist", tone: "warn" },
  request:  { labelKey: "marketplaceCtaRequest",  tone: "brand" },
  contact:  { labelKey: "marketplaceCtaContact",  tone: "brand" },
};

type FilterKey = "all" | "available" | "comingSoon" | "pilot";

function statusMatchesFilter(status: Status, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "available") return status === "available" || status === "beta";
  if (filter === "comingSoon") return status === "comingQ3" || status === "comingQ4" || status === "comingLater";
  if (filter === "pilot") return status === "pilot";
  return true;
}

/** Renders the "from $X/mo" pill on each card — drives clicks to the detail page. */
function PricingHint({ item }: { item: MarketplaceItem }) {
  const { lang } = useLang();
  const { pricing } = item;
  if (!pricing.startingAtKey) return null;
  const amount = pricing.startingAtAmount ?? "";
  const label = t(pricing.startingAtKey, lang).replace("{amount}", amount);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px]"
      style={{ background: "var(--surface-2)", color: "var(--ink-2)", border: "1px solid var(--hair-2)" }}
    >
      {label}
    </span>
  );
}

export function MarketplacePage() {
  const { lang } = useLang();
  const toaster = useToast();
  const workspace = useWorkspace();
  const [filter, setFilter] = useState<FilterKey>("all");

  /* Industry Pack Activate is real product effect; all other CTAs are
   * intent-capture toasts. The detail page does the same — see
   * MarketplaceItemDetail. */
  function handleCta(item: MarketplaceItem) {
    const title = t(item.titleKey, lang);
    const cta = CTA_META[item.cta];
    const ctaLabel = t(cta.labelKey, lang);

    if (item.activatesVertical && item.cta === "activate") {
      const alreadyActive = workspace.vertical === item.activatesVertical;
      workspace.setVertical(alreadyActive ? null : item.activatesVertical);
      toaster.push({
        tone: alreadyActive ? "warn" : "ok",
        title: alreadyActive
          ? t("workspaceVerticalRemovedToast", lang)
          : t("workspaceVerticalSavedToast", lang),
        detail: title,
      });
      return;
    }

    const detail =
      item.cta === "activate"
        ? lang === "es" ? "Quedó registrada tu intención de activar este módulo."
        : lang === "zh" ? "已记录你激活该模块的意向。"
        : "We logged your interest in activating this module."
        : item.cta === "waitlist"
        ? lang === "es" ? "Te avisamos cuando este módulo esté listo para tu workspace."
        : lang === "zh" ? "该模块在你的工作区准备就绪时会通知你。"
        : "We'll notify you when this module ships for your workspace."
        : item.cta === "request"
        ? lang === "es" ? "El equipo te contactará para abrir acceso."
        : lang === "zh" ? "团队将与你联系开通访问权限。"
        : "The team will reach out to open access."
        : lang === "es" ? "Coordinamos una llamada con ventas en breve."
        : lang === "zh" ? "我们很快会安排一次销售通话。"
        : "We'll set up a sales call shortly.";

    toaster.push({
      tone: cta.tone,
      title: `${ctaLabel} · ${title}`,
      detail,
    });
  }

  const filters: { key: FilterKey; labelKey: TranslationKey }[] = [
    { key: "all",         labelKey: "marketplaceFilterAll" },
    { key: "available",   labelKey: "marketplaceFilterAvailable" },
    { key: "comingSoon",  labelKey: "marketplaceFilterComingSoon" },
    { key: "pilot",       labelKey: "marketplaceFilterPilot" },
  ];

  const filteredSections = useMemo(() => {
    return SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter((it) => statusMatchesFilter(it.status, filter)),
    })).filter((s) => s.items.length > 0);
  }, [filter]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        eyebrow={t("marketplaceEyebrow", lang)}
        title={t("marketplaceTitle", lang)}
        subtitle={t("marketplaceSubtitle", lang)}
      />

      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
          <FilterIcon size={11} strokeWidth={1.6} />
          <span className="hidden sm:inline">Filter</span>
        </div>
        <div className="glass-panel-tight flex items-center gap-1 p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="rounded-md px-3 py-1.5 text-[12px] transition-all"
              style={{
                background: filter === f.key ? "rgba(255,255,255,0.08)" : "transparent",
                color: filter === f.key ? "var(--ink)" : "var(--ink-4)",
                boxShadow: filter === f.key ? "inset 0 0 0 1px var(--hair-2)" : undefined,
                fontWeight: filter === f.key ? 600 : 400,
              }}
            >
              {t(f.labelKey, lang)}
            </button>
          ))}
        </div>
      </div>

      {filteredSections.map((section) => {
        const SectionIcon = section.icon;
        return (
          <section key={section.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl"
                style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.3)", color: "var(--brand)" }}
              >
                <SectionIcon size={16} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[16px] font-semibold" style={{ color: "var(--ink)" }}>
                  {t(section.titleKey, lang)}
                </h2>
                <p className="text-[12.5px] leading-snug" style={{ color: "var(--ink-4)" }}>
                  {t(section.descKey, lang)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                const status = STATUS_META[item.status];
                const cta = CTA_META[item.cta];
                const isActiveVertical =
                  !!item.activatesVertical && workspace.vertical === item.activatesVertical;
                return (
                  <SectionCard
                    key={item.id}
                    className="flex flex-col gap-3 p-4"
                    interactive
                    style={
                      isActiveVertical
                        ? { borderColor: item.accent, boxShadow: `inset 0 0 0 1px ${item.accent}, 0 0 24px color-mix(in oklch, ${item.accent} 22%, transparent)` }
                        : undefined
                    }
                  >
                    {/* The whole body (icon + text + pricing) navigates to the detail
                     * page. The CTA button is a separate click target so it doesn't
                     * trigger navigation accidentally. */}
                    <Link href={`/console/marketplace/${item.id}`} className="flex flex-col gap-3 group">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
                          style={{
                            background: `color-mix(in oklch, ${item.accent} 14%, transparent)`,
                            border: `1px solid color-mix(in oklch, ${item.accent} 35%, transparent)`,
                            color: item.accent,
                          }}
                        >
                          <ItemIcon size={16} strokeWidth={1.6} />
                        </div>
                        <span
                          className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
                          style={
                            isActiveVertical
                              ? { background: `color-mix(in oklch, ${item.accent} 18%, transparent)`, color: item.accent, border: `1px solid color-mix(in oklch, ${item.accent} 50%, transparent)` }
                              : { background: status.bg, color: status.color, border: `1px solid ${status.border}` }
                          }
                        >
                          {isActiveVertical ? t("workspaceVerticalActiveBadge", lang) : t(status.labelKey, lang)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[14px] font-semibold transition-colors group-hover:text-[color:var(--brand)]" style={{ color: "var(--ink)" }}>
                          {t(item.titleKey, lang)}
                        </h3>
                        <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: "var(--ink-4)" }}>
                          {t(item.descKey, lang)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <PricingHint item={item} />
                        <span
                          className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider opacity-60 transition-opacity group-hover:opacity-100"
                          style={{ color: "var(--ink-3)" }}
                        >
                          {lang === "es" ? "Detalle" : lang === "zh" ? "详情" : "Details"}
                          <ArrowRight size={10} strokeWidth={1.8} />
                        </span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCta(item)}
                      className="btn btn-sm justify-center"
                      style={
                        isActiveVertical
                          ? { background: item.accent, color: "#0A0D12", borderColor: "transparent" }
                          : item.status === "available" || item.status === "beta"
                          ? { background: "var(--brand)", color: "#0A0D12", borderColor: "transparent" }
                          : undefined
                      }
                    >
                      {isActiveVertical
                        ? (lang === "es" ? "Desactivar pack" : lang === "zh" ? "停用包" : "Deactivate pack")
                        : t(cta.labelKey, lang)}
                      {!isActiveVertical && <ArrowRight size={11} strokeWidth={1.8} />}
                    </button>
                  </SectionCard>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Footer CTA strip */}
      <div
        className="flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: "linear-gradient(180deg, oklch(0.78 0.09 235 / 0.12), rgba(255,255,255,0.02))",
          border: "1px solid oklch(0.78 0.09 235 / 0.3)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full"
            style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.4)", color: "var(--brand)" }}
          >
            <Sparkles size={16} strokeWidth={1.6} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
              {t("marketplaceFooterTitle", lang)}
            </p>
            <p className="mt-1 text-[12.5px] leading-snug" style={{ color: "var(--ink-3)" }}>
              {t("marketplaceFooterDetail", lang)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            toaster.push({
              tone: "ok",
              title: t("marketplaceCtaContact", lang),
              detail:
                lang === "es"
                  ? "Te contactaremos en menos de 24 horas."
                  : lang === "zh"
                  ? "我们将在 24 小时内与你联系。"
                  : "We'll reach out within 24 hours.",
            })
          }
          className="btn btn-primary justify-center"
        >
          {t("marketplaceCtaContact", lang)}
          <ArrowRight size={13} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
