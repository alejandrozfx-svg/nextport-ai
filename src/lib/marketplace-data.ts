/* Marketplace data — items + sections + pricing.
 *
 * Extracted from MarketplacePage so both the list view and the detail page
 * (/console/marketplace/[id]) consume the same source of truth.
 *
 * Pricing model (PRD-13 evolution): every item exposes up to 3 cadences —
 * monthly, annual (with savings), on-demand (per-unit). Some items are
 * commission-only (insurance, factoring, broker marketplace) and surface
 * a commission rate instead. Others are enterprise-only and surface a
 * "talk to sales" pill.
 *
 * Honest demo: prices are realistic suggestions for the demo era — they
 * change once we have real pilots + pricing experiments. Activation flow
 * remains toast-only (no Stripe wired yet).
 */

import {
  Apple, Banknote, BarChart3, Car, Code2, Cpu, Database, FlaskConical,
  Gavel, HeartPulse, Mail, MessageCircle, Package, Send, Shield, Shirt,
  Sparkles, Store, Umbrella, Users,
  type LucideIcon,
} from "lucide-react";
import type { TranslationKey } from "./i18n";
import type { Vertical } from "./workspace-context";

export type Status = "available" | "beta" | "comingQ3" | "comingQ4" | "comingLater" | "pilot";
export type CtaKind = "activate" | "waitlist" | "request" | "contact";
export type BillingCadence = "monthly" | "annual" | "onDemand";

export interface PriceTier {
  /** Numeric amount in the chosen currency. */
  amount: number;
  currency: "USD" | "MXN";
  /** "per operation", "per query", "per inbound message", etc. */
  unit?: string;
  /** Display tag for annual e.g. "Save 17%". */
  savings?: string;
  /** Helper text under the price (e.g. "$416 USD/mo equivalent"). */
  helper?: string;
}

export interface ItemPricing {
  monthly?: PriceTier;
  annual?: PriceTier;
  onDemand?: PriceTier;
  /** When set, this item is commission-only — replaces the 3 plans. */
  commission?: { ratePct: string; basis: TranslationKey };
  /** "Included in <plan>" — replaces all 3 plans. */
  includedIn?: "free" | "pro" | "enterprise";
  /** Short headline shown on the card: "from $X/mo" / "Commission only" / "Enterprise pricing". */
  startingAtKey?: TranslationKey;
  /** Optional override for the headline number (e.g. "$499", "8-12%"). */
  startingAtAmount?: string;
}

export interface MarketplaceItem {
  id: string;
  icon: LucideIcon;
  accent: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  /** Long-form description for the detail page (rendered as paragraphs). */
  longDescKey?: TranslationKey;
  /** What's included checklist for the detail page. */
  includesKeys?: TranslationKey[];
  /** Optional step-by-step "how it works" — surfaces the transaction flow for
   * network items (brokers / insurance / factoring) and the operational flow
   * for everything else. Each key is a single step (1-5 steps recommended). */
  howItWorksKeys?: TranslationKey[];
  /** Optional regulators pills (Industry Packs). */
  regulators?: string[];
  status: Status;
  cta: CtaKind;
  pricing: ItemPricing;
  /** When set, activating this item flips the workspace vertical (real product effect). */
  activatesVertical?: Vertical;
}

export interface MarketplaceSection {
  id: string;
  icon: LucideIcon;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  items: MarketplaceItem[];
}

/* ── Pricing helpers ───────────────────────────────────────────── */
const pricingPack = (monthlyAmount: number, perOp: number): ItemPricing => ({
  monthly:  { amount: monthlyAmount,        currency: "USD" },
  annual:   { amount: monthlyAmount * 10,   currency: "USD", savings: "Save 17%", helper: `$${Math.round((monthlyAmount * 10) / 12)} USD/mo equivalent` },
  onDemand: { amount: perOp,                currency: "USD", unit: "per operation processed" },
  startingAtAmount: `$${monthlyAmount}`,
  startingAtKey: "marketplacePricingFromMonthly",
});

const pricingChannel = (monthly: number, perMsg?: number): ItemPricing => ({
  monthly:  { amount: monthly,        currency: "USD" },
  annual:   { amount: monthly * 10,   currency: "USD", savings: "Save 17%", helper: `$${Math.round((monthly * 10) / 12)} USD/mo equivalent` },
  ...(perMsg ? { onDemand: { amount: perMsg, currency: "USD", unit: "per inbound message" } } : {}),
  startingAtAmount: `$${monthly}`,
  startingAtKey: "marketplacePricingFromMonthly",
});

/* ── Section + item registry ───────────────────────────────────── */
export const SECTIONS: MarketplaceSection[] = [
  {
    id: "packs",
    icon: Package,
    titleKey: "marketplaceSectionPacks",
    descKey: "marketplaceSectionPacksDesc",
    items: [
      {
        id: "auto",
        icon: Car, accent: "var(--brand)",
        titleKey: "packAuto", descKey: "packAutoDesc", longDescKey: "packAutoLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["NOM-142", "NOM-161", "IMMEX", "AGEX", "HS 8703-8708"],
        status: "beta", cta: "activate", activatesVertical: "auto",
        pricing: pricingPack(499, 25),
      },
      {
        id: "medical",
        icon: HeartPulse, accent: "var(--risk)",
        titleKey: "packMedical", descKey: "packMedicalDesc", longDescKey: "packMedicalLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["COFEPRIS", "NOM-241", "Registro sanitario"],
        status: "beta", cta: "activate", activatesVertical: "medical",
        pricing: pricingPack(749, 35),
      },
      {
        id: "textile",
        icon: Shirt, accent: "var(--ok)",
        titleKey: "packTextile", descKey: "packTextileDesc", longDescKey: "packTextileLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["NOM-004", "T-MEC", "Padrón sectorial"],
        status: "beta", cta: "activate", activatesVertical: "textile",
        pricing: pricingPack(399, 18),
      },
      {
        id: "agrofood",
        icon: Apple, accent: "var(--ok)",
        titleKey: "packAgrofood", descKey: "packAgrofoodDesc", longDescKey: "packAgrofoodLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["SENASICA", "COFEPRIS alimentos", "Certificado fitosanitario"],
        status: "comingQ4", cta: "waitlist",
        pricing: pricingPack(599, 28),
      },
      {
        id: "electronics",
        icon: Cpu, accent: "var(--brand)",
        titleKey: "packElectronics", descKey: "packElectronicsDesc", longDescKey: "packElectronicsLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["NOM-001-SCFI", "IFT homologación", "NOM-024-SCFI"],
        status: "comingQ4", cta: "waitlist",
        pricing: pricingPack(449, 22),
      },
      {
        id: "chemicals",
        icon: FlaskConical, accent: "var(--warn)",
        titleKey: "packChemicals", descKey: "packChemicalsDesc", longDescKey: "packChemicalsLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["SEMARNAT", "NOM-018", "Hoja de seguridad", "HS 28-38"],
        status: "comingLater", cta: "waitlist",
        pricing: pricingPack(699, 32),
      },
      {
        id: "cosmetics",
        icon: Sparkles, accent: "var(--accent)",
        titleKey: "packCosmetics", descKey: "packCosmeticsDesc", longDescKey: "packCosmeticsLong",
        includesKeys: ["packIncludesRules", "packIncludesTemplates", "packIncludesAi", "packIncludesPlaybooks", "packIncludesAcademy"],
        howItWorksKeys: ["packStep1Activate", "packStep2Rules", "packStep3Playbooks", "packStep4Academy", "packStep5Priority"],
        regulators: ["COFEPRIS cosméticos", "NOM-141", "Aviso sanitario"],
        status: "comingLater", cta: "waitlist",
        pricing: pricingPack(449, 20),
      },
    ],
  },
  {
    id: "channels",
    icon: MessageCircle,
    titleKey: "marketplaceSectionChannels",
    descKey: "marketplaceSectionChannelsDesc",
    items: [
      {
        id: "whatsapp",
        icon: MessageCircle, accent: "var(--ok)",
        titleKey: "channelWhatsapp", descKey: "channelWhatsappDesc", longDescKey: "channelWhatsappLong",
        includesKeys: ["channelIncludesAutoFile", "channelIncludesMultiBroker", "channelIncludesMediaSupport"],
        howItWorksKeys: ["channelWaStep1", "channelWaStep2", "channelWaStep3", "channelWaStep4"],
        status: "comingQ4", cta: "waitlist",
        pricing: pricingChannel(199, 0.04),
      },
      {
        id: "telegram",
        icon: Send, accent: "var(--brand)",
        titleKey: "channelTelegram", descKey: "channelTelegramDesc", longDescKey: "channelTelegramLong",
        includesKeys: ["channelTgIncludesBot", "channelTgIncludesForward", "channelTgIncludesMedia"],
        howItWorksKeys: ["channelTgStep1", "channelTgStep2", "channelTgStep3"],
        status: "beta", cta: "activate",
        pricing: { includedIn: "free", startingAtKey: "marketplacePricingIncludedFree" },
      },
      {
        id: "email",
        icon: Mail, accent: "var(--brand)",
        titleKey: "channelEmailPlus", descKey: "channelEmailPlusDesc", longDescKey: "channelEmailPlusLong",
        includesKeys: ["channelIncludesOutlook", "channelIncludesDrive", "channelIncludesSharePoint"],
        howItWorksKeys: ["channelEmailStep1", "channelEmailStep2", "channelEmailStep3", "channelEmailStep4"],
        status: "available", cta: "activate",
        pricing: pricingChannel(99),
      },
      {
        id: "erp",
        icon: Database, accent: "var(--warn)",
        titleKey: "channelERP", descKey: "channelERPDesc", longDescKey: "channelERPLong",
        includesKeys: ["channelIncludesSap", "channelIncludesNetsuite", "channelIncludesOracle", "channelIncludesSla"],
        howItWorksKeys: ["channelErpStep1", "channelErpStep2", "channelErpStep3", "channelErpStep4", "channelErpStep5"],
        status: "pilot", cta: "contact",
        pricing: { startingAtKey: "marketplacePricingEnterprise" },
      },
    ],
  },
  {
    id: "compliance",
    icon: Shield,
    titleKey: "marketplaceSectionCompliance",
    descKey: "marketplaceSectionComplianceDesc",
    items: [
      {
        id: "sanctions",
        icon: Shield, accent: "var(--risk)",
        titleKey: "complianceSanctions", descKey: "complianceSanctionsDesc", longDescKey: "complianceSanctionsLong",
        includesKeys: ["complianceIncludesOfac", "complianceIncludesEfos", "complianceIncludesPep", "complianceIncludesBeneficial"],
        howItWorksKeys: ["complianceSanctionsStep1", "complianceSanctionsStep2", "complianceSanctionsStep3", "complianceSanctionsStep4"],
        status: "comingQ4", cta: "request",
        pricing: {
          monthly:  { amount: 499,  currency: "USD" },
          annual:   { amount: 4990, currency: "USD", savings: "Save 17%", helper: "$416 USD/mo equivalent" },
          onDemand: { amount: 1,    currency: "USD", unit: "per screening" },
          startingAtAmount: "$499",
          startingAtKey: "marketplacePricingFromMonthly",
        },
      },
      {
        id: "audit",
        icon: Gavel, accent: "var(--brand)",
        titleKey: "complianceCustoms", descKey: "complianceCustomsDesc", longDescKey: "complianceAuditLong",
        includesKeys: ["complianceAuditIncludesSat", "complianceAuditIncludesQuarterly", "complianceAuditIncludesRedFlag", "complianceAuditIncludesManifest"],
        howItWorksKeys: ["complianceAuditStep1", "complianceAuditStep2", "complianceAuditStep3"],
        status: "available", cta: "activate",
        pricing: {
          monthly: { amount: 99,  currency: "USD" },
          annual:  { amount: 990, currency: "USD", savings: "Save 17%", helper: "$82 USD/mo equivalent" },
          startingAtAmount: "$99",
          startingAtKey: "marketplacePricingFromMonthly",
        },
      },
    ],
  },
  {
    id: "network",
    icon: Users,
    titleKey: "marketplaceSectionNetwork",
    descKey: "marketplaceSectionNetworkDesc",
    items: [
      {
        id: "brokers",
        icon: Users, accent: "var(--brand)",
        titleKey: "networkBrokers", descKey: "networkBrokersDesc", longDescKey: "networkBrokersLong",
        includesKeys: ["networkBrokersIncludesRanking", "networkBrokersIncludesQuotes", "networkBrokersIncludesEscrow", "networkBrokersIncludesHistory"],
        howItWorksKeys: ["networkBrokersStep1", "networkBrokersStep2", "networkBrokersStep3", "networkBrokersStep4", "networkBrokersStep5"],
        status: "comingLater", cta: "waitlist",
        pricing: {
          commission: { ratePct: "8-12%", basis: "networkCommissionBrokerBasis" },
          startingAtKey: "marketplacePricingCommissionOnly",
          startingAtAmount: "8-12%",
        },
      },
      {
        id: "insurance",
        icon: Umbrella, accent: "var(--ok)",
        titleKey: "networkInsurance", descKey: "networkInsuranceDesc", longDescKey: "networkInsuranceLong",
        includesKeys: ["networkInsuranceIncludesInline", "networkInsuranceIncludesPartners", "networkInsuranceIncludesTiers", "networkInsuranceIncludesPolicy"],
        howItWorksKeys: ["networkInsuranceStep1", "networkInsuranceStep2", "networkInsuranceStep3", "networkInsuranceStep4", "networkInsuranceStep5"],
        status: "comingLater", cta: "waitlist",
        pricing: {
          commission: { ratePct: "15-25%", basis: "networkCommissionInsuranceBasis" },
          startingAtKey: "marketplacePricingCommissionOnly",
          startingAtAmount: "15-25%",
        },
      },
      {
        id: "factoring",
        icon: Banknote, accent: "var(--warn)",
        titleKey: "networkFactoring", descKey: "networkFactoringDesc", longDescKey: "networkFactoringLong",
        includesKeys: ["networkFactoringIncludesQuote", "networkFactoringIncludesAdvance", "networkFactoringIncludesPartner", "networkFactoringIncludesNoUI"],
        howItWorksKeys: ["networkFactoringStep1", "networkFactoringStep2", "networkFactoringStep3", "networkFactoringStep4", "networkFactoringStep5"],
        status: "comingLater", cta: "waitlist",
        pricing: {
          commission: { ratePct: "1-2%", basis: "networkCommissionFactoringBasis" },
          startingAtKey: "marketplacePricingCommissionOnly",
          startingAtAmount: "1-2%",
        },
      },
    ],
  },
  {
    id: "apis",
    icon: Code2,
    titleKey: "marketplaceSectionApis",
    descKey: "marketplaceSectionApisDesc",
    items: [
      {
        id: "hs-api",
        icon: Code2, accent: "var(--brand)",
        titleKey: "apiHs", descKey: "apiHsDesc", longDescKey: "apiHsLong",
        includesKeys: ["apiIncludesHsCode", "apiIncludesAlternatives", "apiIncludesDuty", "apiIncludesWhiteLabel"],
        howItWorksKeys: ["apiHsStep1", "apiHsStep2", "apiHsStep3", "apiHsStep4"],
        status: "comingLater", cta: "waitlist",
        pricing: {
          monthly:  { amount: 99,    currency: "USD", helper: "5K queries/mo" },
          annual:   { amount: 990,   currency: "USD", savings: "Save 17%", helper: "60K queries/yr" },
          onDemand: { amount: 0.08,  currency: "USD", unit: "per query" },
          startingAtAmount: "$0.08",
          startingAtKey: "marketplacePricingFromPerCall",
        },
      },
      {
        id: "intel",
        icon: BarChart3, accent: "var(--accent)",
        titleKey: "apiIntel", descKey: "apiIntelDesc", longDescKey: "apiIntelLong",
        includesKeys: ["apiIntelIncludesDuties", "apiIntelIncludesEta", "apiIntelIncludesBrokers", "apiIntelIncludesOrigin"],
        howItWorksKeys: ["apiIntelStep1", "apiIntelStep2", "apiIntelStep3", "apiIntelStep4"],
        status: "comingLater", cta: "waitlist",
        pricing: {
          monthly:  { amount: 499,  currency: "USD", helper: "Dashboard access" },
          annual:   { amount: 4990, currency: "USD", savings: "Save 17%", helper: "Dashboard + quarterly reports" },
          onDemand: { amount: 99,   currency: "USD", unit: "per benchmark report" },
          startingAtAmount: "$99",
          startingAtKey: "marketplacePricingFromPerReport",
        },
      },
    ],
  },
  {
    id: "partner",
    icon: Store,
    titleKey: "marketplaceSectionPartner",
    descKey: "marketplaceSectionPartnerDesc",
    items: [
      {
        id: "white-label",
        icon: Store, accent: "var(--brand)",
        titleKey: "partnerBroker", descKey: "partnerBrokerDesc", longDescKey: "partnerBrokerLong",
        includesKeys: ["partnerBrokerIncludesBrand", "partnerBrokerIncludesDomain", "partnerBrokerIncludesUsers", "partnerBrokerIncludesMigration", "partnerBrokerIncludesSla"],
        howItWorksKeys: ["partnerBrokerStep1", "partnerBrokerStep2", "partnerBrokerStep3", "partnerBrokerStep4", "partnerBrokerStep5"],
        status: "pilot", cta: "contact",
        pricing: {
          monthly: { amount: 999,  currency: "USD", helper: "per broker workspace" },
          annual:  { amount: 9990, currency: "USD", savings: "Save 17%", helper: "$833 USD/mo equivalent" },
          startingAtAmount: "$999",
          startingAtKey: "marketplacePricingFromMonthly",
        },
      },
      {
        id: "embed-sdk",
        icon: Code2, accent: "var(--accent)",
        titleKey: "partnerEmbed", descKey: "partnerEmbedDesc", longDescKey: "partnerEmbedLong",
        includesKeys: ["partnerEmbedIncludesUpload", "partnerEmbedIncludesViewer", "partnerEmbedIncludesAudit", "partnerEmbedIncludesEvents"],
        howItWorksKeys: ["partnerEmbedStep1", "partnerEmbedStep2", "partnerEmbedStep3", "partnerEmbedStep4"],
        status: "comingLater", cta: "request",
        pricing: {
          monthly:  { amount: 299,  currency: "USD" },
          annual:   { amount: 2990, currency: "USD", savings: "Save 17%" },
          onDemand: { amount: 0.02, currency: "USD", unit: "per SDK call" },
          startingAtAmount: "$0.02",
          startingAtKey: "marketplacePricingFromPerCall",
        },
      },
    ],
  },
];

/* Flat index by item id for O(1) detail-page lookups. */
export const ITEMS_BY_ID: Record<string, MarketplaceItem> = SECTIONS.flatMap((s) => s.items)
  .reduce<Record<string, MarketplaceItem>>((acc, it) => {
    acc[it.id] = it;
    return acc;
  }, {});

export function getItemById(id: string): MarketplaceItem | null {
  return ITEMS_BY_ID[id] ?? null;
}
