"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LANGS = ["EN", "ES", "ZH"] as const;
type LangUI = (typeof LANGS)[number];

const copy: Record<LangUI, { tagline: string; sub: string; email: string; password: string; cta: string; signing: string; err: string }> = {
  EN: {
    tagline: "AI control tower for import compliance.",
    sub: "Classify documents, detect exceptions, and get pedimento-ready — with AI-assisted review at every stage.",
    email: "Email",
    password: "Password",
    cta: "Sign in to console",
    signing: "Signing in…",
    err: "Invalid credentials. Use demo@nextport.ai / demo123",
  },
  ES: {
    tagline: "Torre de control IA para cumplimiento aduanero.",
    sub: "Clasifica documentos, detecta excepciones y prepara tu pedimento — con revisión IA en cada etapa.",
    email: "Correo",
    password: "Contraseña",
    cta: "Entrar a la consola",
    signing: "Iniciando sesión…",
    err: "Credenciales inválidas. Usa demo@nextport.ai / demo123",
  },
  ZH: {
    tagline: "进口合规的AI控制塔。",
    sub: "在每个阶段借助AI辅助审查，分类文件、检测异常、准备报关单。",
    email: "电子邮件",
    password: "密码",
    cta: "登录控制台",
    signing: "登录中…",
    err: "凭据无效。请使用 demo@nextport.ai / demo123",
  },
};

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangUI>("EN");
  const [email, setEmail] = useState("demo@nextport.ai");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const c = copy[lang];

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Demo auth — skip real next-auth for now
    await new Promise((r) => setTimeout(r, 700));

    if (email === "demo@nextport.ai" && password === "demo123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("np_lang", lang.toLowerCase());
        localStorage.setItem("np_user", JSON.stringify({ name: "Alejandro Reyes", initials: "AR", role: "admin", email }));
      }
      router.push("/console/operations");
    } else {
      setError(c.err);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.78 0.09 235 / 0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 80%, oklch(0.70 0.16 25 / 0.06) 0%, transparent 60%)",
        }}
      />
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--brand)", color: "#0A0D12" }}
          >
            N
          </div>
          <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
            Nextport AI
          </span>
        </div>
        {/* Language switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-full liquid-glass"
          style={{ border: "1px solid var(--hair-2)" }}
        >
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                lang === l
                  ? "text-white"
                  : "hover:opacity-80"
              )}
              style={
                lang === l
                  ? { background: "var(--brand-soft)", color: "var(--brand)" }
                  : { color: "var(--ink-3)" }
              }
            >
              {l}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div className="fade-up">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
              style={{ background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.3)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              Live · SAT · VUCEM connected
            </div>
            <h1
              className="font-display text-5xl lg:text-6xl leading-tight mb-5"
              style={{ color: "var(--ink)" }}
            >
              {c.tagline}
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--ink-3)" }}>
              {c.sub}
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {["SAT · VUCEM", "SAP · Oracle", "SOC 2", "ISO 27001", "IMMEX Ready"].map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full text-xs font-mono"
                  style={{ border: "1px solid var(--hair-2)", color: "var(--ink-4)" }}
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Feature list */}
            <ul className="mt-10 space-y-3">
              {[
                "AI document classification with 95%+ accuracy",
                "Real-time SAT & VUCEM integration",
                "Exception detection before pedimento submission",
                "Full audit trail for SOC 2 compliance",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-3)" }}>
                  <span style={{ color: "var(--ok)" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — sign-in card */}
          <div
            className="glass-panel p-8 fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--ink)" }}>
              Sign in to console
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-3)" }}>
              Demo credentials pre-filled below
            </p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--ink-3)" }}>
                  {c.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all font-mono"
                  style={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--hair-2)",
                    color: "var(--ink)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--hair-2)")}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--ink-3)" }}>
                  {c.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all font-mono"
                  style={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--hair-2)",
                    color: "var(--ink)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--hair-2)")}
                />
              </div>

              {error && (
                <p className="text-xs" style={{ color: "var(--risk)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
                style={{ background: "var(--brand)", color: "#0A0D12" }}
              >
                {loading ? c.signing : c.cta}
              </button>
            </form>

            <p className="text-xs mt-4 text-center" style={{ color: "var(--ink-4)" }}>
              Demo mode · No real data stored
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center gap-6 px-8 py-5">
        <span className="text-xs" style={{ color: "var(--ink-4)" }}>
          © 2026 Nextport AI
        </span>
        <span style={{ color: "var(--hair-2)" }}>·</span>
        <span className="text-xs" style={{ color: "var(--ink-4)" }}>
          Trade Compliance Platform
        </span>
        <span style={{ color: "var(--hair-2)" }}>·</span>
        <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
          v0.1.0
        </span>
      </footer>
    </div>
  );
}
