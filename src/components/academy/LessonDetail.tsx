"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Bot, FileText } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { getLesson, pick, pickArray } from "@/lib/academy-content";

interface LessonDetailProps {
  lessonId: string;
}

const levelColors: Record<string, string> = {
  beginner: "var(--ok)",
  intermediate: "var(--warn)",
  advanced: "var(--risk)",
};

export function LessonDetail({ lessonId }: LessonDetailProps) {
  const { lang } = useLang();
  const lesson = getLesson(lessonId);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [tutorOpen, setTutorOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  function toggleItem(i: number) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function markComplete() {
    if (!lesson) return;
    setMarking(true);
    try {
      // Optimistic — works even if the DB is offline.
      setCompleted(true);
      // Best-effort persistence; ignore failures.
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 2000);
      await fetch(`/api/academy/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
        signal: ctrl.signal,
      }).catch(() => {});
    } finally {
      setMarking(false);
    }
  }

  if (!lesson) {
    return (
      <div className="p-6 text-sm" style={{ color: "var(--ink-4)" }}>
        {lang === "es" ? "Módulo no encontrado." : lang === "zh" ? "未找到模块。" : "Lesson not found."}
      </div>
    );
  }

  const color = levelColors[lesson.level] ?? "var(--brand)";
  const keyPoints = pickArray(lesson.keyPoints, lang);
  const progress = Math.round((checkedItems.size / Math.max(keyPoints.length, 1)) * 100);

  const labels = {
    backToAcademy: lang === "es" ? "Academia" : lang === "zh" ? "学院" : "Academy",
    lessonProgress: lang === "es" ? "Progreso del módulo" : lang === "zh" ? "模块进度" : "Lesson progress",
    sections: lang === "es" ? "Secciones" : lang === "zh" ? "章节" : "Sections",
    keyTakeaways: lang === "es" ? "Puntos clave" : lang === "zh" ? "关键要点" : "Key takeaways",
    references: lang === "es" ? "Referencias normativas" : lang === "zh" ? "参考法规" : "Regulatory references",
    markComplete: lang === "es" ? "Marcar módulo como completado" : lang === "zh" ? "标记模块完成" : "Mark module complete",
    marking: lang === "es" ? "Guardando…" : lang === "zh" ? "保存中…" : "Marking…",
    completed: lang === "es" ? "¡Módulo completado!" : lang === "zh" ? "模块已完成！" : "Module completed!",
    minutes: lang === "es" ? "minutos" : lang === "zh" ? "分钟" : "minutes",
    askTopic: lang === "es" ? "Pregunta sobre este tema" : lang === "zh" ? "询问此主题" : "Ask about this topic",
    askDesc: lang === "es" ? "Obtén explicaciones y ejemplos asistidos por IA" : lang === "zh" ? "获取AI辅助的解释和示例" : "Get AI-powered explanations and examples",
    keyPointsCount: lang === "es" ? "puntos clave" : lang === "zh" ? "关键要点" : "key points",
    sectionsCount: lang === "es" ? "secciones" : lang === "zh" ? "章节" : "sections",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/console/academy"
          className="flex items-center gap-1 text-xs hover:opacity-80"
          style={{ color: "var(--ink-4)" }}
        >
          <ArrowLeft size={12} />
          {labels.backToAcademy}
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Main content */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {/* Header */}
          <div>
            <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>{lesson.moduleNum}</span>
            <h1 className="text-2xl font-display mt-1" style={{ color: "var(--ink)" }}>
              {pick(lesson.title, lang)}
            </h1>
            <p className="text-base mt-2 leading-relaxed" style={{ color: "var(--ink-3)" }}>
              {pick(lesson.intro, lang)}
            </p>
          </div>

          {/* Progress against key takeaways */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--ink-4)" }}>
                {labels.lessonProgress} · {checkedItems.size}/{keyPoints.length}
              </p>
              <span className="text-xs font-mono" style={{ color: "var(--brand)" }}>{progress}%</span>
            </div>
            <ProgressBar value={progress} color="var(--brand)" />
          </div>

          {/* Sections with real content */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--ink-4)" }}>
              {labels.sections} ({lesson.sections.length})
            </h2>
            {lesson.sections.map((section, i) => (
              <article key={i} className="glass-panel p-5 space-y-2">
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono"
                    style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>
                      {pick(section.title, lang)}
                    </h3>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--ink-3)" }}>
                      {pick(section.body, lang)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Key takeaways — interactive checklist */}
          <div className="glass-panel p-5 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ink-4)" }}>
              {labels.keyTakeaways} ({keyPoints.length})
            </h2>
            {keyPoints.map((item, i) => {
              const checked = checkedItems.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:opacity-80"
                  style={{
                    background: checked ? "var(--ok-soft)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${checked ? "oklch(0.78 0.13 155 / 0.25)" : "var(--hair)"}`,
                  }}
                >
                  {checked ? (
                    <CheckCircle2 size={15} style={{ color: "var(--ok)", flexShrink: 0, marginTop: 1 }} />
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5"
                      style={{ borderColor: "var(--hair-2)" }}
                    />
                  )}
                  <span className="text-sm leading-relaxed" style={{ color: checked ? "var(--ink-2)" : "var(--ink)" }}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* References */}
          {lesson.references.length > 0 && (
            <div className="glass-panel-tight p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ink-4)" }}>
                {labels.references}
              </h2>
              <ul className="space-y-2">
                {lesson.references.map((ref, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <FileText size={12} style={{ color: "var(--ink-4)", marginTop: 2, flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "var(--ink-2)" }}>{ref.label}</div>
                      <div className="font-mono mt-0.5" style={{ color: "var(--ink-4)" }}>{ref.source}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mark complete CTA */}
          {!completed && (
            <button
              onClick={markComplete}
              disabled={marking}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: "var(--ok)", color: "#0A0D12" }}
            >
              {marking ? labels.marking : labels.markComplete}
            </button>
          )}

          {completed && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid oklch(0.78 0.13 155 / 0.3)" }}
            >
              <CheckCircle2 size={16} />
              <span className="text-sm font-medium">{labels.completed}</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 space-y-3 sticky top-20">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: color + "22", color }}
              >
                {t(lesson.level, lang)}
              </span>
              <span className="text-xs" style={{ color: "var(--ink-4)" }}>
                {pick(lesson.levelName, lang)}
              </span>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                <Clock size={11} />
                {lesson.durationMin} {labels.minutes}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                <BookOpen size={11} />
                {lesson.sections.length} {labels.sectionsCount} · {keyPoints.length} {labels.keyPointsCount}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lesson.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--hair)", color: "var(--ink-4)" }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Ask tutor */}
            <button
              onClick={() => setTutorOpen(true)}
              className="w-full p-3 rounded-xl text-left transition-all hover:opacity-90 mt-2"
              style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.2)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bot size={14} style={{ color: "var(--brand)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>{labels.askTopic}</span>
              </div>
              <p className="text-xs" style={{ color: "var(--ink-3)" }}>
                {labels.askDesc}
              </p>
            </button>
          </div>
        </div>
      </div>

      {tutorOpen && <AssistantPanel onClose={() => setTutorOpen(false)} context={pick(lesson.title, lang)} />}
    </div>
  );
}
