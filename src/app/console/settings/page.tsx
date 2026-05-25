"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Bell, Globe, Database, Shield, Store } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { useToast } from "@/components/ui/ToastProvider";
import { useWorkspace, VERTICAL_META, ALL_VERTICALS, type Vertical } from "@/lib/workspace-context";
import { t, type Lang, type TranslationKey } from "@/lib/i18n";

const NOTIFICATION_KEYS = [
  "notificationNewOps",
  "notificationExceptions",
  "notificationApprovals",
  "notificationEta",
  "notificationIntegrations",
] as const satisfies readonly TranslationKey[];

type NotificationKey = (typeof NOTIFICATION_KEYS)[number];

export default function SettingsPage() {
  const { lang, setLang } = useLang();
  const router = useRouter();
  const toaster = useToast();
  const workspace = useWorkspace();
  const [email, setEmail] = useState("diegosolorzano@nextport.com");
  const [name, setName] = useState("Diego Solórzano");
  const [saved, setSaved] = useState(false);
  const [databaseUrl, setDatabaseUrl] = useState("");
  // P3: notifications toggles were decorative <div>s — now real state, persisted to localStorage.
  // Default everything on so the first visit shows the intended demo state.
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>(() => {
    const initial = {} as Record<NotificationKey, boolean>;
    NOTIFICATION_KEYS.forEach((k) => { initial[k] = true; });
    return initial;
  });
  const [clearing, setClearing] = useState<"idle" | "confirm" | "done">("idle");

  // Load saved user from localStorage (populated by landing-page sign-in or previous Save).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("np_user");
      if (stored) {
        const parsed = JSON.parse(stored) as { name?: string; email?: string };
        if (parsed.name)  setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {}
    try {
      const storedNotifs = localStorage.getItem("np_notifications");
      if (storedNotifs) {
        const parsed = JSON.parse(storedNotifs) as Partial<Record<NotificationKey, boolean>>;
        setNotifications((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
    try {
      const storedDb = localStorage.getItem("np_database_url");
      if (storedDb) setDatabaseUrl(storedDb);
    } catch {}
  }, []);

  function toggleNotification(key: NotificationKey) {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("np_notifications", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function handleClearDemoData() {
    if (clearing === "idle") {
      setClearing("confirm");
      // Auto-dismiss the confirm state after 6s if user does nothing.
      setTimeout(() => setClearing((c) => (c === "confirm" ? "idle" : c)), 6000);
      return;
    }
    if (clearing === "confirm") {
      try {
        localStorage.removeItem("np_user");
        localStorage.removeItem("np_notifications");
        localStorage.removeItem("np_database_url");
        sessionStorage.removeItem("np_evidence_exports");
        sessionStorage.removeItem("np_ops_state");
      } catch {}
      setClearing("done");
      toaster.push({
        tone: "ok",
        title: lang === "es" ? "Datos del demo limpiados" : lang === "zh" ? "演示数据已清除" : "Demo data cleared",
        detail: lang === "es" ? "Volviendo al landing." : lang === "zh" ? "返回首页。" : "Returning to landing.",
      });
      setTimeout(() => router.push("/"), 900);
    }
  }

  function handleSave() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("np_user");
        const prev = stored ? (JSON.parse(stored) as Record<string, unknown>) : {};
        const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "DS";
        localStorage.setItem("np_user", JSON.stringify({ ...prev, name, email, initials }));
        // DATABASE_URL — demo only. Live demo doesn't actually connect; we just round-trip it.
        if (databaseUrl) localStorage.setItem("np_database_url", databaseUrl);
        else localStorage.removeItem("np_database_url");
      } catch {}
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sections = [
    {
      id: "profile",
      label: t("profile", lang),
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>{t("fullName", lang)}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>{t("email", lang)}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "workspace",
      label: t("workspace", lang),
      icon: Store,
      content: (
        <div className="space-y-3">
          <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
            {t("workspaceVerticalHint", lang)}
          </p>
          <div>
            <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-4)" }}>{t("workspaceVertical", lang)}</label>
            <select
              value={workspace.vertical ?? ""}
              onChange={(e) => {
                const next = e.target.value === "" ? null : (e.target.value as Vertical);
                workspace.setVertical(next);
                toaster.push({
                  tone: next ? "ok" : "warn",
                  title: next ? t("workspaceVerticalSavedToast", lang) : t("workspaceVerticalRemovedToast", lang),
                  detail: next ? t(VERTICAL_META[next].nameKey, lang) : t("workspaceVerticalNone", lang),
                });
              }}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="">{t("workspaceVerticalNone", lang)}</option>
              {ALL_VERTICALS.map((v) => (
                <option key={v} value={v}>{t(VERTICAL_META[v].nameKey, lang)}</option>
              ))}
            </select>
          </div>
          {workspace.vertical && (() => {
            const meta = VERTICAL_META[workspace.vertical];
            const Icon = meta.icon;
            return (
              <div
                className="flex items-start gap-3 rounded-lg p-3"
                style={{
                  background: `color-mix(in oklch, ${meta.accent} 10%, transparent)`,
                  border: `1px solid color-mix(in oklch, ${meta.accent} 35%, transparent)`,
                }}
              >
                <div
                  className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${meta.accent} 16%, transparent)`,
                    border: `1px solid color-mix(in oklch, ${meta.accent} 40%, transparent)`,
                    color: meta.accent,
                  }}
                >
                  <Icon size={15} strokeWidth={1.7} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                      {t(meta.nameKey, lang)}
                    </span>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                      style={{ background: `color-mix(in oklch, ${meta.accent} 18%, transparent)`, color: meta.accent }}
                    >
                      {t("workspaceVerticalActiveBadge", lang)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px]" style={{ color: "var(--ink-3)" }}>
                    {t(meta.descKey, lang)}
                  </p>
                  <p className="mt-2 text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                    {t("workspaceVerticalRegulators", lang)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {meta.regulators.map((r) => (
                      <span
                        key={r}
                        className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                        style={{ background: "var(--surface-2)", color: "var(--ink-2)" }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ),
    },
    {
      id: "preferences",
      label: t("preferences", lang),
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>{t("language", lang)}</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      label: t("notifications", lang),
      icon: Bell,
      content: (
        <div className="space-y-3">
          {NOTIFICATION_KEYS.map((item) => {
            const on = notifications[item];
            return (
              <button
                key={item}
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => toggleNotification(item)}
                className="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left hover:opacity-90"
              >
                <span
                  className="relative h-4 w-8 rounded-full transition-colors"
                  style={{ background: on ? "var(--brand)" : "var(--surface-3)" }}
                >
                  <span
                    className="absolute top-0.5 h-3 w-3 rounded-full transition-all"
                    style={{ background: on ? "#0A0D12" : "var(--ink-4)", right: on ? 2 : "calc(100% - 14px)" }}
                  />
                </span>
                <span className="text-sm" style={{ color: "var(--ink-2)" }}>{t(item, lang)}</span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "database",
      label: t("database", lang),
      icon: Database,
      content: (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            {t("databaseDesc", lang)}
          </p>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>DATABASE_URL</label>
            <input
              type="password"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="postgresql://user:password@host/db"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            />
          </div>
          <p className="text-xs" style={{ color: "var(--ink-4)" }}>
            {t("databaseHelp", lang)}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>{t("settingsTitle", lang)}</h2>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>{t("settingsSubtitle", lang)}</p>
        </div>
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium sm:w-auto"
          style={{ background: saved ? "var(--ok)" : "var(--brand)", color: "#0A0D12" }}
        >
          <Save size={13} />
          {saved ? t("saved", lang) : t("saveChanges", lang)}
        </button>
      </div>

      <div className="space-y-4">
        {sections.map(({ id, label, icon: Icon, content }) => (
          <div key={id} className="glass-panel overflow-hidden">
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid var(--hair)", background: "rgba(255,255,255,0.015)" }}
            >
              <Icon size={14} style={{ color: "var(--ink-4)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{label}</h3>
            </div>
            <div className="p-4">{content}</div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="glass-panel overflow-hidden" style={{ border: "1px solid oklch(0.70 0.16 25 / 0.25)" }}>
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid oklch(0.70 0.16 25 / 0.2)", background: "var(--risk-soft)" }}
        >
          <Shield size={14} style={{ color: "var(--risk)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--risk)" }}>{t("dangerZone", lang)}</h3>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            {t("destructiveActions", lang)}
          </p>
          <button
            type="button"
            onClick={handleClearDemoData}
            disabled={clearing === "done"}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              border: "1px solid oklch(0.70 0.16 25 / 0.35)",
              color: clearing === "confirm" ? "#0A0D12" : "var(--risk)",
              background: clearing === "confirm" ? "var(--risk)" : "transparent",
            }}
          >
            {clearing === "confirm"
              ? (lang === "es" ? "Confirma — esto borra el demo" : lang === "zh" ? "确认 — 这将清除演示" : "Confirm — this wipes the demo")
              : clearing === "done"
              ? (lang === "es" ? "Listo" : lang === "zh" ? "完成" : "Done")
              : t("clearDemoData", lang)}
          </button>
          {clearing === "confirm" && (
            <p className="text-xs" style={{ color: "var(--ink-4)" }}>
              {lang === "es"
                ? "Borra usuario, preferencias y exports locales. La sesión se cerrará."
                : lang === "zh"
                ? "清除用户、偏好和本地导出。会话将关闭。"
                : "Wipes user, preferences and local exports. Session will end."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
