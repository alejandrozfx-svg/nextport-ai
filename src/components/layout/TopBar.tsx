"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ScanLine, Bell, Sun, Moon, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { useTheme } from "@/lib/theme-context";
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
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onClick(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileMenuOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMobileMenuOpen(false);
    router.push(`/console/operations?q=${encodeURIComponent(q)}`);
  }

  return (
    <header
      className="console-topbar fixed top-0 flex items-center gap-2 px-3 sm:gap-4 sm:px-6"
      style={{
        background: "var(--topbar-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--hair)",
        zIndex: 30,
      }}
    >
      <h1 className="min-w-0 flex-1 truncate text-sm font-semibold md:flex-none" style={{ color: "var(--ink)" }}>
        {title}
      </h1>

      {/* Search */}
      <form onSubmit={submitSearch} className="hidden max-w-md flex-1 md:block">
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

      <div className="flex items-center gap-1.5 sm:gap-2 md:ml-auto">
        {/* Language switcher */}
        <div
          className="hidden items-center rounded-full p-0.5 sm:flex"
          style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}
        >
          {LANGS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLang(key)}
              className="rounded-full px-2.5 py-1 text-[11px] transition-all"
              style={{
                background: lang === key ? "var(--surface-3)" : "transparent",
                color: lang === key ? "var(--ink)" : "var(--ink-4)",
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
          className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all hover:opacity-90 sm:px-3"
          style={{ background: "var(--brand)", color: "#0A0D12" }}
        >
          <ScanLine size={13} />
          <span className="hidden sm:inline">{t("scanDocs", lang)}</span>
        </button>

        {/* Theme toggle (sun/moon) */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("switchToLight", lang) : t("switchToDark", lang)}
          title={theme === "dark" ? t("lightMode", lang) : t("darkMode", lang)}
          className="hidden w-8 h-8 rounded-lg sm:flex items-center justify-center transition-all hover:opacity-80"
          style={{ border: "1px solid var(--hair)" }}
        >
          {theme === "dark" ? (
            <Sun size={14} style={{ color: "var(--ink-3)" }} />
          ) : (
            <Moon size={14} style={{ color: "var(--ink-3)" }} />
          )}
        </button>

        {/* Bell with dropdown */}
        <div ref={bellRef} className="relative hidden sm:block">
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

        <div ref={mobileMenuRef} className="relative sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={t("mobileMenu", lang)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ border: "1px solid var(--hair)", color: "var(--ink-3)" }}
          >
            <MoreHorizontal size={15} />
          </button>
          {mobileMenuOpen && (
            <div
              className="absolute right-0 top-10 z-50 fade-up w-[min(330px,calc(100vw-24px))] p-3 space-y-3"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--hair)",
                borderRadius: 14,
                boxShadow: "var(--elev-3)",
              }}
            >
              <form onSubmit={submitSearch}>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--hair-2)" }}
                >
                  <Search size={13} style={{ color: "var(--ink-4)" }} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("searchTopBar", lang)}
                    className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                    style={{ color: "var(--ink)", caretColor: "var(--brand)" }}
                  />
                </div>
              </form>

              <div>
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                  {t("language", lang)}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {LANGS.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLang(key)}
                      className="rounded-lg px-3 py-2 text-xs transition-all"
                      style={{
                        background: lang === key ? "var(--surface-3)" : "var(--surface-1)",
                        color: lang === key ? "var(--ink)" : "var(--ink-4)",
                        border: "1px solid var(--hair)",
                        fontWeight: lang === key ? 600 : 400,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={toggleTheme} className="btn btn-sm justify-center">
                  {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
                  {theme === "dark" ? t("lightMode", lang) : t("darkMode", lang)}
                </button>
                <button type="button" className="btn btn-sm justify-center" onClick={() => setBellOpen((v) => !v)}>
                  <Bell size={13} />
                  {t("notifications", lang)}
                </button>
              </div>

              {bellOpen && (
                <div className="glass-panel-tight p-3">
                  <div className="text-[12px] font-medium mb-1" style={{ color: "var(--ink)" }}>
                    {t("notifications", lang)}
                  </div>
                  <div className="text-[11.5px]" style={{ color: "var(--ink-4)" }}>
                    {t("noNotifications", lang)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
