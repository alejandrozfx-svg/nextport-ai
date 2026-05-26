"use client";

/* Detail page for a single Marketplace item (PRD-13 evolution).
 *
 * Surfaces:
 * - Hero with icon, title, status, long description
 * - "What's included" checklist (when item.includesKeys is set)
 * - Regulators pills (Industry Packs)
 * - Pricing card with 3 tabs (Monthly / Annual / On-demand). Each tab shows
 *   amount, cadence helper text and a primary CTA. Items that are commission-
 *   only / included-in-plan / enterprise-only render the appropriate
 *   alternative panel instead of the 3-tab UI.
 * - Activation button at the bottom (toast-based, identical contract to the
 *   list view).
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { useToast } from "@/components/ui/ToastProvider";
import { useWorkspace } from "@/lib/workspace-context";
import { t, type TranslationKey } from "@/lib/i18n";
import { getItemById, type BillingCadence, type MarketplaceItem, type PriceTier } from "@/lib/marketplace-data";

const TAB_LABEL: Record<BillingCadence, TranslationKey> = {
  monthly:  "marketplacePricingTabMonthly",
  annual:   "marketplacePricingTabAnnual",
  onDemand: "marketplacePricingTabOnDemand",
};

const CADENCE_HELPER: Record<BillingCadence, TranslationKey> = {
  monthly:  "marketplacePricingCadenceMonthly",
  annual:   "marketplacePricingCadenceAnnual",
  onDemand: "marketplacePricingCadenceOnDemand",
};

const CADENCE_CTA: Record<BillingCadence, TranslationKey> = {
  monthly:  "marketplacePricingCtaMonthly",
  annual:   "marketplacePricingCtaAnnual",
  onDemand: "marketplacePricingCtaOnDemand",
};

const STATUS_LABEL: Record<MarketplaceItem["status"], { key: TranslationKey; color: string; bg: string; border: string }> = {
  available:   { key: "marketplaceStatusAvailable",   color: "var(--ok)",    bg: "var(--ok-soft)",    border: "oklch(0.78 0.13 155 / 0.4)" },
  beta:        { key: "marketplaceStatusBeta",        color: "var(--brand)", bg: "var(--brand-soft)", border: "oklch(0.78 0.09 235 / 0.4)" },
  comingQ3:    { key: "marketplaceStatusComingQ3",    color: "var(--warn)",  bg: "var(--warn-soft)",  border: "oklch(0.78 0.14 70 / 0.4)"  },
  comingQ4:    { key: "marketplaceStatusComingQ4",    color: "var(--warn)",  bg: "var(--warn-soft)",  border: "oklch(0.78 0.14 70 / 0.4)"  },
  comingLater: { key: "marketplaceStatusComingLater", color: "var(--ink-3)", bg: "rgba(255,255,255,0.04)", border: "var(--hair-2)"          },
  pilot:       { key: "marketplaceStatusPilot",       color: "var(--brand)", bg: "var(--brand-soft)", border: "oklch(0.78 0.09 235 / 0.4)" },
};

function formatAmount(tier: PriceTier): string {
  // Decimals only when < 1 (per-call pricing like $0.08).
  const decimals = tier.amount < 1 ? 2 : 0;
  return `$${tier.amount.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${tier.currency}`;
}

/* Wrapper does the lookup + 404 + hands a guaranteed-non-null item to the
 * inner component. Keeps the rules-of-hooks happy (no conditional hooks). */
export function MarketplaceItemDetail({ id }: { id: string }) {
  const item = getItemById(id);
  if (!item) {
    notFound();
  }
  return <MarketplaceItemDetailInner item={item as MarketplaceItem} />;
}

function MarketplaceItemDetailInner({ item }: { item: MarketplaceItem }) {
  const { lang } = useLang();
  const toaster = useToast();
  const workspace = useWorkspace();

  /* Pick the default selected tab: monthly if present, else annual, else onDemand.
   * Items without any of the 3 tabs render an alternative panel below. */
  const availableTabs = useMemo<BillingCadence[]>(() => {
    const tabs: BillingCadence[] = [];
    if (item.pricing.monthly)  tabs.push("monthly");
    if (item.pricing.annual)   tabs.push("annual");
    if (item.pricing.onDemand) tabs.push("onDemand");
    return tabs;
  }, [item]);
  const [cadence, setCadence] = useState<BillingCadence>(availableTabs[0] ?? "monthly");

  const Icon = item.icon;
  const status = STATUS_LABEL[item.status];
  const isActiveVertical = !!item.activatesVertical && workspace.vertical === item.activatesVertical;

  function dispatchCta(label: string) {
    if (item.activatesVertical) {
      const alreadyActive = workspace.vertical === item.activatesVertical;
      workspace.setVertical(alreadyActive ? null : item.activatesVertical);
      toaster.push({
        tone: alreadyActive ? "warn" : "ok",
        title: alreadyActive
          ? t("workspaceVerticalRemovedToast", lang)
          : t("workspaceVerticalSavedToast", lang),
        detail: `${t(item.titleKey, lang)} · ${label}`,
      });
      return;
    }
    toaster.push({
      tone: "ok",
      title: `${label} · ${t(item.titleKey, lang)}`,
      detail:
        lang === "es"
          ? "Quedó registrada tu intención. El equipo activa el módulo en tu workspace en menos de 24h."
          : lang === "zh"
          ? "已记录你的意向。团队将在 24 小时内在你的工作区激活该模块。"
          : "We logged your intent. The team activates the module in your workspace within 24h.",
    });
  }

  const selectedTier: PriceTier | undefined = cadence === "monthly"
    ? item.pricing.monthly
    : cadence === "annual"
      ? item.pricing.annual
      : item.pricing.onDemand;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Back link */}
      <Link
        href="/console/marketplace"
        className="inline-flex items-center gap-1.5 text-[12px] transition-colors hover:text-[color:var(--ink)]"
        style={{ color: "var(--ink-4)" }}
      >
        <ArrowLeft size={12} strokeWidth={1.8} />
        {t("marketplaceDetailBack", lang)}
      </Link>

      {/* Hero */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl"
          style={{
            background: `color-mix(in oklch, ${item.accent} 14%, transparent)`,
            border: `1px solid color-mix(in oklch, ${item.accent} 35%, transparent)`,
            color: item.accent,
          }}
        >
          <Icon size={28} strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[24px] font-semibold leading-tight" style={{ color: "var(--ink)" }}>
              {t(item.titleKey, lang)}
            </h1>
            <span
              className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
              style={
                isActiveVertical
                  ? { background: `color-mix(in oklch, ${item.accent} 18%, transparent)`, color: item.accent, border: `1px solid color-mix(in oklch, ${item.accent} 50%, transparent)` }
                  : { background: status.bg, color: status.color, border: `1px solid ${status.border}` }
              }
            >
              {isActiveVertical ? t("workspaceVerticalActiveBadge", lang) : t(status.key, lang)}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
            {t(item.descKey, lang)}
          </p>
        </div>
      </header>

      {/* Long description, if any */}
      {item.longDescKey && (
        <p className="max-w-3xl text-[13.5px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
          {t(item.longDescKey, lang)}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        {/* Left column — What's included + Regulators */}
        <div className="space-y-4">
          {item.includesKeys && item.includesKeys.length > 0 && (
            <section className="glass-panel p-5">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                {t("marketplaceDetailIncluded", lang)}
              </h2>
              <ul className="space-y-2">
                {item.includesKeys.map((k) => (
                  <li key={k} className="flex items-start gap-2.5 text-[13px]" style={{ color: "var(--ink-2)" }}>
                    <span
                      className="mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full"
                      style={{ background: "var(--ok-soft)", color: "var(--ok)" }}
                    >
                      <Check size={10} strokeWidth={2.4} />
                    </span>
                    {t(k, lang)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {item.regulators && item.regulators.length > 0 && (
            <section className="glass-panel-tight p-4">
              <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                {t("marketplaceDetailRegulators", lang)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.regulators.map((r) => (
                  <span
                    key={r}
                    className="rounded-full px-2.5 py-1 font-mono text-[11px]"
                    style={{ background: "var(--surface-2)", color: "var(--ink-2)", border: "1px solid var(--hair-2)" }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* How it works — numbered steps. Surfaces the transaction flow for
           * commission-based items (brokers / insurance / factoring) and the
           * operational flow for everything else. */}
          {item.howItWorksKeys && item.howItWorksKeys.length > 0 && (
            <section className="glass-panel p-5">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                {t("marketplaceDetailHowItWorks", lang)}
              </h2>
              <ol className="space-y-3">
                {item.howItWorksKeys.map((stepKey, i) => (
                  <li key={stepKey} className="flex gap-3">
                    <span
                      className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold"
                      style={{
                        background: `color-mix(in oklch, ${item.accent} 16%, transparent)`,
                        border: `1px solid color-mix(in oklch, ${item.accent} 40%, transparent)`,
                        color: item.accent,
                      }}
                    >
                      {i + 1}
                    </span>
                    <p className="flex-1 pt-0.5 text-[13px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                      {t(stepKey, lang)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Right column — Pricing card */}
        <aside className="glass-panel elev-2 overflow-hidden">
          <div className="border-b p-5" style={{ borderColor: "var(--hair)" }}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              {t("marketplaceDetailPricing", lang)}
            </h2>
          </div>

          {/* Variant A — 3-tab pricing */}
          {availableTabs.length > 0 && (
            <div className="p-5">
              <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "var(--surface-1)", border: "1px solid var(--hair)" }}>
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCadence(tab)}
                    className="flex-1 rounded-md px-2 py-1.5 text-[12px] transition-all"
                    style={{
                      background: cadence === tab ? "rgba(255,255,255,0.08)" : "transparent",
                      color: cadence === tab ? "var(--ink)" : "var(--ink-4)",
                      boxShadow: cadence === tab ? "inset 0 0 0 1px var(--hair-2)" : undefined,
                      fontWeight: cadence === tab ? 600 : 400,
                    }}
                  >
                    {t(TAB_LABEL[tab], lang)}
                  </button>
                ))}
              </div>

              {selectedTier && (
                <div className="mt-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[34px] leading-none" style={{ color: "var(--ink)" }}>
                      {formatAmount(selectedTier)}
                    </span>
                    {selectedTier.unit && (
                      <span className="text-[12px]" style={{ color: "var(--ink-4)" }}>
                        / {selectedTier.unit}
                      </span>
                    )}
                  </div>
                  {selectedTier.savings && (
                    <span
                      className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider"
                      style={{ background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid oklch(0.78 0.13 155 / 0.4)" }}
                    >
                      {selectedTier.savings}
                    </span>
                  )}
                  {selectedTier.helper && (
                    <p className="mt-2 text-[11.5px]" style={{ color: "var(--ink-4)" }}>
                      {selectedTier.helper}
                    </p>
                  )}
                  <p className="mt-3 text-[12px]" style={{ color: "var(--ink-3)" }}>
                    {t(CADENCE_HELPER[cadence], lang)}
                  </p>

                  <button
                    type="button"
                    onClick={() => dispatchCta(t(CADENCE_CTA[cadence], lang))}
                    className="btn btn-primary mt-4 w-full justify-center"
                  >
                    {isActiveVertical
                      ? (lang === "es" ? "Desactivar pack" : lang === "zh" ? "停用包" : "Deactivate pack")
                      : t(CADENCE_CTA[cadence], lang)}
                    {!isActiveVertical && <ArrowRight size={13} strokeWidth={1.8} />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Variant B — commission-only */}
          {item.pricing.commission && (
            <div className="p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[34px] leading-none" style={{ color: "var(--ink)" }}>
                  {item.pricing.commission.ratePct}
                </span>
                <span className="text-[12px]" style={{ color: "var(--ink-4)" }}>
                  {t(item.pricing.commission.basis, lang)}
                </span>
              </div>
              <p className="mt-2 text-[12px]" style={{ color: "var(--ink-3)" }}>
                {t("marketplaceCommissionHelper", lang)}
              </p>
              <button
                type="button"
                onClick={() => dispatchCta(t("marketplaceCtaWaitlist", lang))}
                className="btn btn-primary mt-4 w-full justify-center"
              >
                {t("marketplaceCtaWaitlist", lang)}
                <ArrowRight size={13} strokeWidth={1.8} />
              </button>
            </div>
          )}

          {/* Variant C — included in plan */}
          {item.pricing.includedIn && !item.pricing.commission && availableTabs.length === 0 && (
            <div className="p-5">
              <span className="font-display text-[24px] leading-none" style={{ color: "var(--ok)" }}>
                {t("marketplacePricingIncludedFree", lang)}
              </span>
              <p className="mt-3 text-[12px]" style={{ color: "var(--ink-3)" }}>
                {t("marketplaceIncludedHelper", lang)}
              </p>
              <button
                type="button"
                onClick={() => dispatchCta(t("marketplaceCtaActivate", lang))}
                className="btn btn-primary mt-4 w-full justify-center"
              >
                {t("marketplaceCtaActivate", lang)}
                <ArrowRight size={13} strokeWidth={1.8} />
              </button>
            </div>
          )}

          {/* Variant D — enterprise-only */}
          {!item.pricing.commission && !item.pricing.includedIn && availableTabs.length === 0 && (
            <div className="p-5">
              <span className="font-display text-[22px] leading-none" style={{ color: "var(--ink)" }}>
                {t("marketplacePricingEnterprise", lang)}
              </span>
              <p className="mt-3 text-[12px]" style={{ color: "var(--ink-3)" }}>
                {t("marketplaceEnterpriseHelper", lang)}
              </p>
              <button
                type="button"
                onClick={() => dispatchCta(t("marketplacePricingCtaContactSales", lang))}
                className="btn btn-primary mt-4 w-full justify-center"
              >
                {t("marketplacePricingCtaContactSales", lang)}
                <ArrowRight size={13} strokeWidth={1.8} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
