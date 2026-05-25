"use client";

/* Workspace context (D-006 Camino A · Industry Packs).
 * Today this surface only holds the active vertical pack — the foundation
 * that lets the rest of the app conditionally surface sector-specific rules,
 * playbooks, Academy modules and validations.
 *
 * Persistence: localStorage["np_workspace_vertical"]. SSR-safe (default null
 * until the client hydrates). Wired in ConsoleShell so every console route
 * gets the provider.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Apple, Car, Cpu, FlaskConical, HeartPulse, Shirt, Sparkles, type LucideIcon } from "lucide-react";

export type Vertical =
  | "auto"
  | "medical"
  | "textile"
  | "agrofood"
  | "electronics"
  | "chemicals"
  | "cosmetics";

export interface VerticalMeta {
  id: Vertical;
  icon: LucideIcon;
  /** OKLCH-friendly CSS var or hex used for chips / pack cards. */
  accent: string;
  /** i18n key for the localized display name. */
  nameKey: import("./i18n").TranslationKey;
  /** i18n key for the short description shown next to the selector. */
  descKey: import("./i18n").TranslationKey;
  /** Regulators / controls this pack pre-activates — surfaces in tooltips. */
  regulators: string[];
}

export const VERTICAL_META: Record<Vertical, VerticalMeta> = {
  auto:        { id: "auto",        icon: Car,          accent: "var(--brand)",   nameKey: "packAuto",        descKey: "packAutoDesc",        regulators: ["NOM-142", "NOM-161", "IMMEX", "AGEX"] },
  medical:     { id: "medical",     icon: HeartPulse,   accent: "var(--risk)",    nameKey: "packMedical",     descKey: "packMedicalDesc",     regulators: ["COFEPRIS", "NOM-241"] },
  textile:     { id: "textile",     icon: Shirt,        accent: "var(--ok)",      nameKey: "packTextile",     descKey: "packTextileDesc",     regulators: ["NOM-004", "T-MEC", "Padrón sectorial"] },
  agrofood:    { id: "agrofood",    icon: Apple,        accent: "var(--ok)",      nameKey: "packAgrofood",    descKey: "packAgrofoodDesc",    regulators: ["SENASICA", "COFEPRIS alimentos"] },
  electronics: { id: "electronics", icon: Cpu,          accent: "var(--brand)",   nameKey: "packElectronics", descKey: "packElectronicsDesc", regulators: ["NOM-001-SCFI", "IFT"] },
  chemicals:   { id: "chemicals",   icon: FlaskConical, accent: "var(--warn)",    nameKey: "packChemicals",   descKey: "packChemicalsDesc",   regulators: ["SEMARNAT", "NOM-018"] },
  cosmetics:   { id: "cosmetics",   icon: Sparkles,     accent: "var(--accent)",  nameKey: "packCosmetics",   descKey: "packCosmeticsDesc",   regulators: ["COFEPRIS cosméticos", "NOM-141"] },
};

export const ALL_VERTICALS: Vertical[] = Object.keys(VERTICAL_META) as Vertical[];

interface WorkspaceCtx {
  /** Active vertical pack — null means "general / no pack". */
  vertical: Vertical | null;
  setVertical: (v: Vertical | null) => void;
  /** True once we've read localStorage on the client. Lets surfaces avoid
   * flashing "general" UI before the persisted value loads. */
  hydrated: boolean;
}

const Ctx = createContext<WorkspaceCtx | null>(null);

const STORAGE_KEY = "np_workspace_vertical";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [vertical, setVerticalState] = useState<Vertical | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && (ALL_VERTICALS as string[]).includes(stored)) {
        setVerticalState(stored as Vertical);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const setVertical = useCallback((v: Vertical | null) => {
    setVerticalState(v);
    if (typeof window === "undefined") return;
    try {
      if (v) window.localStorage.setItem(STORAGE_KEY, v);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo<WorkspaceCtx>(() => ({ vertical, setVertical, hydrated }), [vertical, setVertical, hydrated]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace(): WorkspaceCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Defensive fallback — outside provider, behave as "general" workspace.
    return { vertical: null, setVertical: () => {}, hydrated: true };
  }
  return ctx;
}
