"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Bot } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";

interface LessonDetailProps {
  lessonId: string;
}

interface LessonData {
  id: string;
  moduleNum: string;
  title: string;
  level: string;
  durationMin: number;
  tags: string[];
  intro: string;
  lessons: string[];
  levelName: string;
  levelTag: string;
  progress: { completed: boolean } | null;
}

export function LessonDetail({ lessonId }: LessonDetailProps) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [tutorOpen, setTutorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetch("/api/academy")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.lessons ?? []).find((l: LessonData) => l.id === lessonId);
        setLesson(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

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
      await fetch(`/api/academy/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      setLesson((prev) => prev ? { ...prev, progress: { completed: true } } : prev);
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  }

  const levelColors = { beginner: "var(--ok)", intermediate: "var(--warn)", advanced: "var(--risk)" };
  const color = levelColors[lesson?.level as keyof typeof levelColors] ?? "var(--brand)";
  const progress = lesson ? Math.round((checkedItems.size / Math.max(lesson.lessons.length, 1)) * 100) : 0;

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--ink-4)" }}>Loading lesson…</div>;
  if (!lesson) return <div className="p-6 text-sm" style={{ color: "var(--ink-4)" }}>Lesson not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/console/academy"
          className="flex items-center gap-1 text-xs hover:opacity-80"
          style={{ color: "var(--ink-4)" }}
        >
          <ArrowLeft size={12} />
          Academy
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Main content */}
        <div className="col-span-8 space-y-5">
          <div>
            <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>{lesson.moduleNum}</span>
            <h1 className="text-2xl font-display mt-1" style={{ color: "var(--ink)" }}>{lesson.title}</h1>
            <p className="text-base mt-2" style={{ color: "var(--ink-3)" }}>{lesson.intro}</p>
          </div>

          {/* Progress */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--ink-4)" }}>
                Lesson Progress · {checkedItems.size}/{lesson.lessons.length}
              </p>
              <span className="text-xs font-mono" style={{ color: "var(--brand)" }}>{progress}%</span>
            </div>
            <ProgressBar value={progress} color="var(--brand)" />
          </div>

          {/* Lessons checklist */}
          <div className="glass-panel p-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ink-4)" }}>
              Lessons ({lesson.lessons.length})
            </h3>
            {lesson.lessons.map((item, i) => {
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
                  <span className="text-sm" style={{ color: checked ? "var(--ink-2)" : "var(--ink)" }}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mark complete */}
          {!lesson.progress?.completed && (
            <button
              onClick={markComplete}
              disabled={marking}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: "var(--ok)", color: "#0A0D12" }}
            >
              {marking ? "Marking…" : "Mark Module Complete"}
            </button>
          )}

          {lesson.progress?.completed && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid oklch(0.78 0.13 155 / 0.3)" }}
            >
              <CheckCircle2 size={16} />
              <span className="text-sm font-medium">Module completed!</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          <div className="glass-panel p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                style={{ background: color + "22", color }}
              >
                {lesson.level}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                <Clock size={11} />
                {lesson.durationMin} minutes
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                <BookOpen size={11} />
                {lesson.lessons.length} lessons
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lesson.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--hair)", color: "var(--ink-4)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Ask tutor */}
          <button
            onClick={() => setTutorOpen(true)}
            className="w-full p-4 rounded-xl text-left transition-all hover:opacity-90"
            style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.2)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Bot size={14} style={{ color: "var(--brand)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>Ask about this topic</span>
            </div>
            <p className="text-xs" style={{ color: "var(--ink-3)" }}>
              Get AI-powered explanations and examples
            </p>
          </button>
        </div>
      </div>

      {tutorOpen && <AssistantPanel onClose={() => setTutorOpen(false)} context={lesson.title} />}
    </div>
  );
}
