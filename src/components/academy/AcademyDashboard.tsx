"use client";

import { useState } from "react";
import { GraduationCap, Search, BookOpen, Clock, Bot, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { ACADEMY_LESSONS, type AcademyLesson, pick } from "@/lib/academy-content";

const levelColors = {
  beginner: "var(--ok)",
  intermediate: "var(--warn)",
  advanced: "var(--risk)",
};

export function AcademyDashboard() {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [tutorOpen, setTutorOpen] = useState(false);

  const filtered = ACADEMY_LESSONS.filter((l) => {
    if (levelFilter !== "all" && l.level !== levelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const title = pick(l.title, lang).toLowerCase();
      const intro = pick(l.intro, lang).toLowerCase();
      return (
        title.includes(q) ||
        intro.includes(q) ||
        l.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Progress is tracked client-side (no DB) — for now show 0%.
  const completedCount = 0;
  const total = ACADEMY_LESSONS.length;
  const progressPct = 0;

  const byLevel: Record<string, AcademyLesson[]> = {};
  filtered.forEach((l) => {
    if (!byLevel[l.level]) byLevel[l.level] = [];
    byLevel[l.level].push(l);
  });

  const minutesLabel = lang === "es" ? "min" : lang === "zh" ? "分钟" : "min";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
            {t("academyTitle", lang)}
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>
            {t("academySubtitle", lang)}
          </p>
        </div>
        <button
          onClick={() => setTutorOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
          style={{ background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.25)" }}
        >
          <Bot size={14} />
          {t("askTutor", lang)}
        </button>
      </div>

      {/* Overall progress */}
      <div className="glass-panel p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-soft)" }}>
          <GraduationCap size={20} style={{ color: "var(--brand)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              {lang === "es"
                ? `Tu progreso · ${completedCount}/${total} módulos completados`
                : lang === "zh"
                ? `你的进度 · ${completedCount}/${total} 个模块已完成`
                : `Your progress · ${completedCount}/${total} modules completed`}
            </p>
            <span className="text-sm font-mono" style={{ color: "var(--brand)" }}>{progressPct}%</span>
          </div>
          <ProgressBar value={progressPct} color="var(--brand)" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "var(--bg-2)", border: "1px solid var(--hair-2)" }}
        >
          <Search size={12} style={{ color: "var(--ink-4)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "es" ? "Buscar módulos…" : lang === "zh" ? "搜索模块…" : "Search modules…"}
            className="bg-transparent text-xs outline-none w-40"
            style={{ color: "var(--ink)" }}
          />
        </div>
        {(["all", "beginner", "intermediate", "advanced"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              levelFilter === l
                ? { background: "rgba(255,255,255,0.07)", color: "var(--ink)", border: "1px solid var(--hair-2)" }
                : { color: "var(--ink-4)", border: "1px solid transparent" }
            }
          >
            {l === "all"
              ? (lang === "es" ? "Todos los niveles" : lang === "zh" ? "所有级别" : "All levels")
              : t(l, lang)}
          </button>
        ))}
      </div>

      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        const levelLessons = byLevel[level];
        if (!levelLessons || levelLessons.length === 0) return null;
        const color = levelColors[level];

        return (
          <div key={level}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: color + "22", color }}
              >
                {t(level, lang)}
              </span>
              <span className="text-xs" style={{ color: "var(--ink-4)" }}>
                0/{levelLessons.length} {t("completed", lang).toLowerCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {levelLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/console/academy/${lesson.id}`}
                  className="glass-panel p-4 space-y-3 hover:opacity-90 transition-opacity block"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                        {lesson.moduleNum}
                      </span>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--ink)" }}>
                        {pick(lesson.title, lang)}
                      </p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5"
                      style={{ borderColor: "var(--hair-2)" }}
                    />
                  </div>

                  <p className="text-xs line-clamp-2 leading-snug" style={{ color: "var(--ink-4)" }}>
                    {pick(lesson.intro, lang)}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {lesson.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--hair)", color: "var(--ink-4)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                    <Clock size={10} />
                    {lesson.durationMin} {minutesLabel}
                    <BookOpen size={10} />
                    <span>{pick(lesson.levelName, lang)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {tutorOpen && <AssistantPanel onClose={() => setTutorOpen(false)} context="Academy" />}
    </div>
  );
}
