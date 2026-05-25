"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, ScanLine, Bell, Sun, Moon, MoreHorizontal, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { useTheme } from "@/lib/theme-context";
import { t, type Lang } from "@/lib/i18n";
import { DEMO_OPERATIONS } from "@/lib/demo-data";

const PAGE_TITLE_KEYS: Record<string, "pageTitleOperations" | "pageTitlePipeline" | "pageTitleDocuments" | "pageTitleIntelligence" | "pageTitleIntegrations" | "pageTitleSecurity" | "pageTitleAcademy" | "pageTitleMarketplace" | "pageTitleSettings"> = {
  "/console/operations":   "pageTitleOperations",
  "/console/pipeline":     "pageTitlePipeline",
  "/console/documents":    "pageTitleDocuments",
  "/console/intelligence": "pageTitleIntelligence",
  "/console/integrations": "pageTitleIntegrations",
  "/console/security":     "pageTitleSecurity",
  "/console/academy":      "pageTitleAcademy",
  "/console/marketplace":  "pageTitleMarketplace",
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

  /* P3: bell used to render an empty "No notifications" placeholder. Now it derives
   * actionable items from the live demo data — risk ops, review ops, ready handoff. */
  const notifications = useMemo(() => {
    const items: Array<{
      id: string;
      tone: "risk" | "warn" | "ok";
      title: string;
      detail: string;
      href: string;
    }> = [];
    DEMO_OPERATIONS.filter((op) => op.status === "risk").slice(0, 3).forEach((op) => {
      items.push({
        id: `risk-${op.id}`,
        tone: "risk",
        title: lang === "es" ? `${op.supplierShort} · en riesgo` : lang === "zh" ? `${op.supplierShort} · 风险` : `${op.supplierShort} · at risk`,
        detail: op.flags[0]?.title ?? (lang === "es" ? "Excepción detectada" : lang === "zh" ? "检测到异常" : "Exception detected"),
        href: `/console/operations/${op.id}`,
      });
    });
    DEMO_OPERATIONS.filter((op) => op.status === "review").slice(0, 2).forEach((op) => {
      items.push({
        id: `review-${op.id}`,
        tone: "warn",
        title: lang === "es" ? `${op.supplierShort} · necesita revisión` : lang === "zh" ? `${op.supplierShort} · 需审核` : `${op.supplierShort} · needs review`,
        detail: lang === "es" ? `ETA ${op.eta} · ${op.docCount}/${op.docsExpected} docs` : lang === "zh" ? `ETA ${op.eta} · ${op.docCount}/${op.docsExpected} 文件` : `ETA ${op.eta} · ${op.docCount}/${op.docsExpected} docs`,
        href: `/console/operations/${op.id}`,
      });
    });
    const ready = DEMO_OPERATIONS.filter((op) => op.status === "ready");
    if (ready.length > 0) {
      items.push({
        id: "ready-batch",
        tone: "ok",
        title: lang === "es" ? `${ready.length} operaciones listas` : lang === "zh" ? `${ready.length} 个运营就绪` : `${ready.length} operations ready`,
        detail: lang === "es" ? "Listas para handoff a ERP / aduana." : lang === "zh" ? "可移交给 ERP / 海关。" : "Ready for ERP / customs handoff.",
        href: "/console/operations?filter=ready",
      });
    }
    return items;
  }, [lang]);

  const unreadCount = notifications.filter((n) => n.tone !== "ok").length;
  const notifIconMap = { risk: AlertTriangle, warn: Clock, ok: CheckCircle2 } as const;
  const notifColorMap = { risk: "var(--risk)", warn: "var(--warn)", ok: "var(--ok)" } as const;

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
            aria-label={t("notifications", lang)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ border: "1px solid var(--hair)" }}
          >
            <Bell size={14} style={{ color: "var(--ink-3)" }} />
            {unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-bold tabular"
                style={{ background: "var(--risk)", color: "#0A0D12" }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {bellOpen && (
            <div
              className="absolute right-0 top-10 z-50 fade-up overflow-hidden"
              style={{
                width: 320,
                background: "var(--bg-2)",
                border: "1px solid var(--hair)",
                borderRadius: 12,
                boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--hair)" }}>
                <div className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                  {t("notifications", lang)}
                </div>
                {unreadCount > 0 && (
                  <span className="text-[10.5px] font-mono tabular" style={{ color: "var(--ink-4)" }}>
                    {unreadCount} {lang === "es" ? "pendientes" : lang === "zh" ? "待处理" : "open"}
                  </span>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-5 text-[11.5px]" style={{ color: "var(--ink-4)" }}>
                  {t("noNotifications", lang)}
                </div>
              ) : (
                <ul className="max-h-[320px] overflow-y-auto">
                  {notifications.map((n) => {
                    const IconC = notifIconMap[n.tone];
                    const color = notifColorMap[n.tone];
                    return (
                      <li key={n.id} style={{ borderBottom: "1px solid var(--hair)" }}>
                        <Link
                          href={n.href}
                          onClick={() => setBellOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]"
                        >
                          <span
                            className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full"
                            style={{ background: `${color}1F`, color }}
                          >
                            <IconC size={11} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px]" style={{ color: "var(--ink)" }}>{n.title}</div>
                            <div className="truncate text-[11px]" style={{ color: "var(--ink-4)" }}>{n.detail}</div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
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
