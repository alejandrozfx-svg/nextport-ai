import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck2,
  GitBranch,
  LockKeyhole,
  MailCheck,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Metric = {
  value: string;
  label: string;
};

type Section = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
};

type Source = {
  label: string;
  href: string;
};

export type MarketingPageConfig = {
  navKey: "platform" | "compliance" | "integrations" | "pricing";
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  primaryCta?: string;
  secondaryCta?: string;
  metrics: Metric[];
  sections: Section[];
  workflowTitle: string;
  workflow: Array<{ label: string; detail: string }>;
  sources: Source[];
};

const navItems = [
  { key: "platform", label: "Plataforma", href: "/platform" },
  { key: "compliance", label: "Cumplimiento", href: "/compliance" },
  { key: "integrations", label: "Integraciones", href: "/integrations" },
  { key: "pricing", label: "Precios", href: "/pricing" },
] as const;

const iconMap = [MailCheck, FileCheck2, Database, GitBranch, ShieldCheck, Network, LockKeyhole, Sparkles];

export function MarketingSubpage({ page }: { page: MarketingPageConfig }) {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0 -z-10">
        <video
          className="h-full w-full object-cover opacity-35"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/assets/tracker.mp4"
        />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_8%,rgba(122,176,224,0.20),transparent_60%),linear-gradient(180deg,rgba(0,0,0,0.55),#05070A_58%,#0A0D12)]" />
        <div className="absolute inset-0 grid-bg opacity-35" />
      </div>

      <header className="relative z-20 px-4 py-5 sm:px-6 sm:py-6">
        <nav className="liquid-glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Nextport AI home">
            <span className="brand-mark block h-6 w-6" />
            <span className="text-[15px] font-semibold tracking-tight">
              Nextport <span style={{ color: "var(--ink-3)" }}>AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-[13px] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={item.key === page.navKey ? "text-white" : "text-white/65 transition-colors hover:text-white"}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/console" className="btn btn-primary btn-sm">
            Entrar a consola <ArrowRight size={13} />
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:pb-20 lg:pt-16">
        <div>
          <div className="chip chip-brand mb-5">
            <span className="dot" />
            {page.badge}
          </div>
          <p className="mb-4 text-[12px] uppercase tracking-[0.24em] text-white/40">{page.eyebrow}</p>
          <h1 className="font-display max-w-[760px] text-[54px] leading-[0.98] text-white sm:text-[72px] lg:text-[86px]">
            {page.title}
          </h1>
          <p className="mt-7 max-w-2xl text-[16px] leading-8 text-white/68">{page.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/console" className="btn btn-primary">
              {page.primaryCta ?? "Ver demo"} <ArrowRight size={15} />
            </Link>
            <Link href="/pricing" className="btn">
              {page.secondaryCta ?? "Ver precios"}
            </Link>
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {page.metrics.map((metric) => (
              <div key={metric.label} className="glass-panel-tight p-4">
                <div className="font-display text-[38px] leading-none">{metric.value}</div>
                <div className="mt-2 text-[12px] leading-5 text-white/55">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">{page.workflowTitle}</p>
            <div className="mt-4 space-y-3">
              {page.workflow.map((step, index) => (
                <div key={step.label} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[11px] text-white/70">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">{step.label}</div>
                    <div className="mt-1 text-[12px] leading-5 text-white/48">{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:px-6 lg:grid-cols-3">
        {page.sections.map((section, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <article key={section.title} className="glass-panel p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[color:var(--brand)]">
                <Icon size={18} />
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">{section.eyebrow}</p>
              <h2 className="mt-3 text-[20px] font-semibold leading-tight">{section.title}</h2>
              <p className="mt-3 text-[13px] leading-6 text-white/58">{section.body}</p>
              <ul className="mt-5 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-[12.5px] leading-5 text-white/68">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[color:var(--ok)]" size={14} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="glass-panel grid gap-5 p-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">Base de investigación</p>
            <h2 className="mt-3 text-[24px] font-semibold">Contenido aterrizado a import compliance real.</h2>
            <p className="mt-3 text-[13px] leading-6 text-white/55">
              Condensamos fuentes oficiales y documentación de plataformas para mantener el marketing alineado con el flujo operativo: documentos, evidencia, controles y sistemas downstream.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {page.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="glass-panel-tight px-4 py-3 text-[12.5px] text-white/70 transition-colors hover:text-white"
              >
                {source.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
