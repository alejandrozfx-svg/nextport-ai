"use client";

import { useState } from "react";
import { Save, User, Bell, Globe, Database, Shield } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import type { Lang } from "@/lib/i18n";

export default function SettingsPage() {
  const { lang, setLang } = useLang();
  const [email, setEmail] = useState("demo@nextport.ai");
  const [name, setName] = useState("Alejandro Reyes");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>Email</label>
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
      id: "preferences",
      label: "Preferences",
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>Language</label>
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
      label: "Notifications",
      icon: Bell,
      content: (
        <div className="space-y-3">
          {[
            "New operations assigned to me",
            "Exception alerts (Risk level)",
            "Approval required reminders",
            "ETA changes (>24h delay)",
            "Integration sync failures",
          ].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-8 h-4 rounded-full relative"
                style={{ background: "var(--brand)" }}
              >
                <div
                  className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full"
                  style={{ background: "#0A0D12" }}
                />
              </div>
              <span className="text-sm" style={{ color: "var(--ink-2)" }}>{item}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      id: "database",
      label: "Database",
      icon: Database,
      content: (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            Configure your PostgreSQL connection. Compatible with Neon, Vercel Postgres, and Supabase.
          </p>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--ink-4)" }}>DATABASE_URL</label>
            <input
              type="password"
              placeholder="postgresql://user:password@host/db"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            />
          </div>
          <p className="text-xs" style={{ color: "var(--ink-4)" }}>
            Update this in your .env file and restart the server. Run <code className="font-mono">npm run db:push</code> to push the schema.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>Settings</h2>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>Manage your account and workspace preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: saved ? "var(--ok)" : "var(--brand)", color: "#0A0D12" }}
        >
          <Save size={13} />
          {saved ? "Saved!" : "Save changes"}
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
          <h3 className="text-sm font-semibold" style={{ color: "var(--risk)" }}>Danger Zone</h3>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-sm" style={{ color: "var(--ink-3)" }}>
            Destructive actions that cannot be undone.
          </p>
          <button
            className="px-3 py-2 rounded-lg text-sm font-medium"
            style={{ border: "1px solid oklch(0.70 0.16 25 / 0.35)", color: "var(--risk)" }}
          >
            Clear all demo data
          </button>
        </div>
      </div>
    </div>
  );
}
