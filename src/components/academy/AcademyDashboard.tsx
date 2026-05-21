"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Search, BookOpen, CheckCircle2, Clock, Bot } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";

const DEMO_LESSONS: LessonData[] = [
  { id: "01", moduleNum: "01", title: "What is an import operation?", level: "beginner", durationMin: 22, tags: ["Operations", "Documents"], intro: "The full lifecycle of an import — from purchase order to customs clearance — and who is responsible at each step.", levelName: "Fundamentals", levelTag: "L1 · Fundamentals", progress: null },
  { id: "02", moduleNum: "02", title: "Core trade documents", level: "beginner", durationMin: 28, tags: ["Documents", "Pedimento", "MVE"], intro: "Each document explained: what it is, what fields matter and how it relates to the others.", levelName: "Fundamentals", levelTag: "L1 · Fundamentals", progress: null },
  { id: "03", moduleNum: "03", title: "Key fields every user should know", level: "beginner", durationMin: 35, tags: ["Documents", "Customs Value", "HS Code"], intro: "The 20 fields the AI extracts most often — and what each one is used for in compliance review.", levelName: "Fundamentals", levelTag: "L1 · Fundamentals", progress: null },
  { id: "04", moduleNum: "04", title: "Document classification", level: "intermediate", durationMin: 18, tags: ["Documents", "AI Governance"], intro: "How the AI knows that a PDF is a Commercial Invoice and not a Packing List — and what to do when it gets it wrong.", levelName: "Document intelligence", levelTag: "L2 · Document intelligence", progress: null },
  { id: "05", moduleNum: "05", title: "Field extraction", level: "intermediate", durationMin: 22, tags: ["Documents", "AI Governance"], intro: "Turning a scanned PDF into structured fields with full source lineage back to the original document.", levelName: "Document intelligence", levelTag: "L2 · Document intelligence", progress: null },
  { id: "06", moduleNum: "06", title: "Cross-validation & exceptions", level: "intermediate", durationMin: 30, tags: ["Exceptions", "Cross-validation"], intro: "How the AI checks fields across multiple documents — and generates exceptions when they don't match.", levelName: "Document intelligence", levelTag: "L2 · Document intelligence", progress: null },
  { id: "07", moduleNum: "07", title: "Pedimento A1 deep dive", level: "intermediate", durationMin: 40, tags: ["Pedimento", "Mexico compliance"], intro: "Every section of the Mexican pedimento de importación: what each field means and how to spot errors.", levelName: "Mexico compliance", levelTag: "L3 · Mexico compliance", progress: null },
  { id: "08", moduleNum: "08", title: "SAT & VUCEM integration", level: "intermediate", durationMin: 25, tags: ["SAT", "VUCEM", "Mexico compliance"], intro: "How Nextport AI connects to SAT and VUCEM to validate pedimentos and detect CFDI discrepancies.", levelName: "Mexico compliance", levelTag: "L3 · Mexico compliance", progress: null },
  { id: "09", moduleNum: "09", title: "INCOTERMS in practice", level: "intermediate", durationMin: 20, tags: ["INCOTERMS", "Customs Value"], intro: "How INCOTERMS affect customs value, who pays freight and insurance, and what to check on the invoice.", levelName: "International trade", levelTag: "L4 · International trade", progress: null },
  { id: "10", moduleNum: "10", title: "HS codes & tariff classification", level: "intermediate", durationMin: 35, tags: ["HS Code", "Tariffs", "Mexico compliance"], intro: "How to read and verify a fracción arancelaria, find the right code and catch misclassification risk.", levelName: "Mexico compliance", levelTag: "L3 · Mexico compliance", progress: null },
  { id: "11", moduleNum: "11", title: "Value discrepancy exceptions", level: "advanced", durationMin: 28, tags: ["Exceptions", "Customs Value"], intro: "How to investigate and resolve invoice-vs-pedimento value mismatches — the most common blocking exception.", levelName: "Exception management", levelTag: "L5 · Exception management", progress: null },
  { id: "12", moduleNum: "12", title: "Human-in-the-loop approval", level: "advanced", durationMin: 20, tags: ["Approval", "AI Governance", "SOC 2"], intro: "Why human approval is required, what the approver is certifying, and how the audit trail is maintained.", levelName: "Governance", levelTag: "L8 · Governance", progress: null },
];

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
  const [loading, setLoading] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);

  useEffect(() => {
    // Start with demo data immediately, then upgrade to real data if DB is available
    setLessons(DEMO_LESSONS);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/academy", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d.lessons?.length) setLessons(d.lessons); })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { ctrl.abort(); clearTimeout(timer); };
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
