"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Search, BookOpen, CheckCircle2, Clock, Bot } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";

interface LessonData {
  id: string;
  moduleNum: string;
  title: string;
  level: string;
  durationMin: number;
  tags: string[];
  intro: string;
  levelName: string;
  levelTag: string;
  progress: { completed: boolean } | null;
}

const levelColors = {
  beginner: "var(--ok)",
  intermediate: "var(--warn)",
  advanced: "var(--risk)",
};

export function AcademyDashboard() {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [tutorOpen, setTutorOpen] = useState(false);

  useEffect(() => {
    fetch("/api/academy")
      .then((r) => r.json())
      .then((d) => { setLessons(d.lessons ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = lessons.filter((l) => {
    if (levelFilter !== "all" && l.level !== levelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const completedCount = lessons.filter((l) => l.progress?.completed).length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const byLevel: Record<string, LessonData[]> = {};
  filtered.forEach((l) => {
    if (!byLevel[l.level]) byLevel[l.level] = [];
    byLevel[l.level].push(l);
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
            Trade Compliance Academy
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>
            Master Mexican import regulations with structured, expert-led modules.
          </p>
        </div>
        <button
          onClick={() => setTutorOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
          style={{ background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.25)" }}
        >
          <Bot size={14} />
          Ask Nextport Tutor
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
              Your Progress · {completedCount}/{lessons.length} modules completed
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
            placeholder="Search modules…"
            className="bg-transparent text-xs outline-none w-40"
            style={{ color: "var(--ink)" }}
          />
        </div>
        {["all", "beginner", "intermediate", "advanced"].map((l) => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={
              levelFilter === l
                ? { background: "rgba(255,255,255,0.07)", color: "var(--ink)", border: "1px solid var(--hair-2)" }
                : { color: "var(--ink-4)", border: "1px solid transparent" }
            }
          >
            {l === "all" ? "All levels" : l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm" style={{ color: "var(--ink-4)" }}>Loading modules…</div>
      ) : (
        ["beginner", "intermediate", "advanced"].map((level) => {
          const levelLessons = byLevel[level];
          if (!levelLessons || levelLessons.length === 0) return null;
          const color = levelColors[level as keyof typeof levelColors] ?? "var(--brand)";

          return (
            <div key={level}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full capitalize"
                  style={{ background: color + "22", color }}
                >
                  {level}
                </span>
                <span className="text-xs" style={{ color: "var(--ink-4)" }}>
                  {levelLessons.filter((l) => l.progress?.completed).length}/{levelLessons.length} completed
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {levelLessons.map((lesson) => {
                  const done = lesson.progress?.completed ?? false;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/console/academy/${lesson.id}`}
                      className="glass-panel p-4 space-y-3 hover:opacity-90 transition-opacity block"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                            {lesson.moduleNum}
                          </span>
                          <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--ink)" }}>
                            {lesson.title}
                          </p>
                        </div>
                        {done ? (
                          <CheckCircle2 size={16} style={{ color: "var(--ok)", flexShrink: 0 }} />
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                            style={{ borderColor: "var(--hair-2)" }}
                          />
                        )}
                      </div>

                      <p className="text-xs line-clamp-2" style={{ color: "var(--ink-4)" }}>
                        {lesson.intro}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {lesson.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "var(--hair)", color: "var(--ink-4)" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                        <Clock size={10} />
                        {lesson.durationMin} min
                        <BookOpen size={10} />
                        <span>{lesson.levelName}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {tutorOpen && <AssistantPanel onClose={() => setTutorOpen(false)} context="Academy" />}
    </div>
  );
}
