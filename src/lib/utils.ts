import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Map app language code → BCP-47 locale tag for Intl APIs. */
function localeFor(lang: string): string {
  if (lang === "es") return "es-MX";
  if (lang === "zh") return "zh-CN";
  return "en-US";
}

export function formatCurrency(value: number, currency: string = "USD", lang: string = "en") {
  return new Intl.NumberFormat(localeFor(lang), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string, lang: string = "en"): string {
  return new Date(date).toLocaleDateString(localeFor(lang), { month: "short", day: "numeric" });
}

export function formatDateTime(date: Date | string, lang: string = "en"): string {
  return new Date(date).toLocaleString(localeFor(lang), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(date: Date | string, lang: string = "en"): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const suffix = lang === "es" ? " atrás" : lang === "zh" ? "前" : " ago";
  if (mins < 60) return lang === "zh" ? `${mins}分钟${suffix}` : `${mins}m${suffix}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return lang === "zh" ? `${hours}小时${suffix}` : `${hours}h${suffix}`;
  const days = Math.floor(hours / 24);
  return lang === "zh" ? `${days}天${suffix}` : `${days}d${suffix}`;
}

export function statusColor(status: string): string {
  switch (status) {
    case "risk": return "var(--risk)";
    case "review": case "warn": return "var(--warn)";
    case "ready": case "ok": return "var(--ok)";
    default: return "var(--brand)";
  }
}
