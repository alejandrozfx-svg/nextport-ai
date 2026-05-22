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

      <header className="relative z-20 px-3 py-4 sm:px-6 sm:py-6">
        <nav className="liquid-glass mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full px-3 py-2.5 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Nextport AI home">
            <span className="brand-mark block h-6 w-6" />
            <span className="text-[14px] font-semibold tracking-tight sm:text-[15px]">
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

          <Link href="/console" className="btn btn-primary btn-sm px-3 sm:px-4" aria-label="Entrar a consola">
            <span className="hidden sm:inline">Entrar a consola</span>
            <span className="sm:hidden">Consola</span>
            <ArrowRight size={13} />
          </Link>
        </nav>
        <div className="mx-auto mt-3 flex max-w-6xl gap-2 overflow-x-auto px-1 pb-1 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`liquid-glass min-w-max rounded-full px-3 py-1.5 text-[12px] ${
                item.key === page.navKey ? "text-white" : "text-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-20 lg:pt-16">
        <div>
          <div className="chip chip-brand mb-4 sm:mb-5">
            <span className="dot" />
            {page.badge}
          </div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/40 sm:mb-4 sm:text-[12px] sm:tracking-[0.24em]">{page.eyebrow}</p>
          <h1 className="font-display max-w-[760px] text-[42px] leading-[1.02] text-white min-[390px]:text-[46px] sm:text-[72px] sm:leading-[0.98] lg:text-[86px]">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[14px] leading-6 text-white/70 sm:mt-7 sm:text-[16px] sm:leading-8">{page.subtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link href="/console" className="btn btn-primary justify-center sm:justify-start">
              {page.primaryCta ?? "Ver demo"} <ArrowRight size={15} />
            </Link>
            <Link href="/pricing" className="btn justify-center sm:justify-start">
              {page.secondaryCta ?? "Ver precios"}
            </Link>
          </div>
        </div>

        <div className="glass-panel p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {page.metrics.map((metric) => (
              <div key={metric.label} className="glass-panel-tight p-3 sm:p-4">
                <div className="font-display text-[30px] leading-none sm:text-[38px]">{metric.value}</div>
                <div className="mt-2 text-[11.5px] leading-5 text-white/55 sm:text-[12px]">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:mt-4">
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

      <section className="mx-auto grid max-w-6xl gap-3 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-3 lg:gap-4">
        {page.sections.map((section, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <article key={section.title} className="glass-panel p-4 sm:p-5">
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

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="glass-panel grid gap-5 p-4 sm:p-5 lg:grid-cols-[0.72fr_1.28fr]">
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
