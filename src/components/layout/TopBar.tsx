"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ScanLine, Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { t, type Lang } from "@/lib/i18n";

const PAGE_TITLE_KEYS: Record<string, "pageTitleOperations" | "pageTitlePipeline" | "pageTitleDocuments" | "pageTitleIntelligence" | "pageTitleIntegrations" | "pageTitleSecurity" | "pageTitleAcademy" | "pageTitleSettings"> = {
  "/console/operations":   "pageTitleOperations",
  "/console/pipeline":     "pageTitlePipeline",
  "/console/documents":    "pageTitleDocuments",
  "/console/intelligence": "pageTitleIntelligence",
  "/console/integrations": "pageTitleIntegrations",
  "/console/security":     "pageTitleSecurity",
  "/console/academy":      "pageTitleAcademy",
  "/console/settings":     "pageTitleSettings",
};

const LANGS: [Lang, string][] = [
  ["en", "EN"],
  ["es", "ES"],
  ["zh", "中"],
];

interface TopBarProps {
  onScan?: () => void;
}

export function TopBar({ onScan }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLang();
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const titleKey = Object.entries(PAGE_TITLE_KEYS).find(
    ([k]) => pathname === k || pathname.startsWith(k + "/")
  )?.[1];
  // Dynamic title for operation detail pages: show the operation ID.
  const opDetailMatch = pathname.match(/^\/console\/operations\/(NP-\d{4}-\d{6})/);
  const title = opDetailMatch
    ? `${lang === "es" ? "Operación" : lang === "zh" ? "运营" : "Operation"} ${opDetailMatch[1]}`
    : titleKey
    ? t(titleKey, lang)
    : "Console";

  // Close bell dropdown on outside click
  useEffect(() => {
    if (!bellOpen) return;
    function onClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [bellOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/console/operations?q=${encodeURIComponent(q)}`);
  }

  return (
    <header
      className="fixed top-0 flex items-center px-6 gap-4"
      style={{
        left: 240,
        right: 0,
        height: 56,
        background: "rgba(10, 13, 18, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--hair)",
        zIndex: 30,
      }}
    >
      <h1 className="text-sm font-semibold flex-shrink-0" style={{ color: "var(--ink)" }}>
        {title}
      </h1>

      {/* Search */}
      <form onSubmit={submitSearch} className="flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}
        >
          <Search size={13} style={{ color: "var(--ink-4)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchTopBar", lang)}
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--ink)", caretColor: "var(--brand)" }}
          />
          <kbd
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{ background: "var(--hair)", color: "var(--ink-4)", fontSize: 10 }}
          >
            ↵
          </kbd>
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Language switcher */}
        <div
          className="flex items-center rounded-full p-0.5"
          style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}
        >
          {LANGS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLang(key)}
              className="rounded-full px-2.5 py-1 text-[11px] transition-all"
              style={{
                background: lang === key ? "rgba(255,255,255,0.12)" : "transparent",
                color: lang === key ? "white" : "var(--ink-4)",
                fontWeight: lang === key ? 600 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scan button */}
        <button
          onClick={onScan}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
          style={{ background: "var(--brand)", color: "#0A0D12" }}
        >
          <ScanLine size={13} />
          {t("scanDocs", lang)}
        </button>

        {/* Bell with dropdown */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setBellOpen((v) => !v)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ border: "1px solid var(--hair)" }}
          >
            <Bell size={14} style={{ color: "var(--ink-3)" }} />
          </button>
          {bellOpen && (
            <div
              className="absolute right-0 top-10 z-50 fade-up"
              style={{
                width: 280,
                background: "var(--bg-2)",
                border: "1px solid var(--hair)",
                borderRadius: 10,
                boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
                padding: 14,
              }}
            >
              <div className="text-[12px] font-medium mb-1" style={{ color: "var(--ink)" }}>
                {t("notifications", lang)}
              </div>
              <div className="text-[11.5px]" style={{ color: "var(--ink-4)" }}>
                {t("noNotifications", lang)}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
