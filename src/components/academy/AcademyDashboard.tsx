"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Award,
  Bot,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  LibraryBig,
  PlayCircle,
  Radio,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
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

type AcademyFilter = "all" | "beginner" | "intermediate" | "advanced" | "masterclass" | "tradevault";

interface TradeVideo {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  updatedAt?: string;
  views?: number;
}

const masterClassCopy = {
  en: {
    tab: "Master class",
    badge: "Incoming event",
    kicker: "Exclusive for Nextport AI users",
    title: "AI for Foreign Trade and Trade Compliance",
    subtitle: "Desteia prepares your team to automate compliance with AI.",
    date: "Wednesday, May 27",
    time: "6:30 pm CDMX time",
    format: "Free virtual webinar",
    promise: "You will leave knowing how to use AI tools to automate practical compliance work.",
    cta: "Reserve my seat",
    reserved: "Seat reserved. You will receive the Zoom link and calendar invite by email.",
    included: "Because you are already a user, this master class is included after your training and comes with a certificate of completion.",
    when: "When",
    where: "Where",
    duration: "Duration",
    whereValue: "Virtual Zoom link + recording after the webinar",
    durationValue: "90 minutes",
    forYouTitle: "This class is for you if:",
    forYou: [
      "You work in foreign trade or trade compliance.",
      "You have repetitive tasks you would like to automate.",
      "You are skeptical about whether AI can actually help your work.",
      "You want something practical without long, slow implementation projects.",
    ],
    noTechnical: "No technical background required. If you use email and Excel, you can take this class.",
    learnTitle: "What you will learn",
    learn: [
      ["Review and group documents with ChatGPT and Zapier", "Automatically detect errors in BLs, invoices, pedimentos and support documents."],
      ["Automate the electronic expediente", "Centralize documents and remove repetitive manual work."],
      ["Audit pedimentos automatically", "Identify inconsistencies and possible errors without manual review."],
      ["Analyze data with AI", "Use tools like Julius to get useful insights without being a technical analyst."],
    ],
    instructorsTitle: "Your instructors",
    testimonialsTitle: "What past attendees say",
    finalCta: "Learn which AI tools you can start using today for trade compliance work.",
  },
  es: {
    tab: "Master class",
    badge: "Evento próximo",
    kicker: "Exclusivo para usuarios de Nextport AI",
    title: "IA para Comercio Exterior y Trade Compliance",
    subtitle: "Desteia prepara a tu equipo para automatizar compliance con IA.",
    date: "Miércoles 27 de mayo",
    time: "6:30 pm hora CDMX",
    format: "Webinar gratuito y virtual",
    promise: "Saldrás sabiendo cómo usar herramientas de IA para automatizar tu trabajo.",
    cta: "Reservar mi lugar",
    reserved: "Lugar reservado. Recibirás el link de Zoom y la invitación de calendario por correo.",
    included: "Por ser usuario, esta master class se te ofrece al finalizar el training e incluye certificado de participación.",
    when: "Cuándo",
    where: "Dónde",
    duration: "Duración",
    whereValue: "Virtual (link de Zoom) + se enviará la grabación después del webinar",
    durationValue: "90 minutos",
    forYouTitle: "Esta clase es para ti si:",
    forYou: [
      "Trabajas en comercio exterior o trade compliance.",
      "Tienes muchas tareas repetitivas que te gustaría automatizar.",
      "Eres escéptico de si la IA te puede ayudar en tu trabajo.",
      "Quieres probar algo práctico sin comprometerte a proyectos largos y lentos de implementar.",
    ],
    noTechnical: "No necesitas conocimiento técnico. Si usas correo y Excel puedes tomar esta clase.",
    learnTitle: "Lo que aprenderás",
    learn: [
      ["Revisar y agrupar documentos con ChatGPT y Zapier", "Detecta errores en BLs, facturas, pedimentos y documentos de soporte automáticamente."],
      ["Automatizar la creación del expediente electrónico", "Centraliza documentos y elimina trabajo manual repetitivo."],
      ["Auditar pedimentos automáticamente", "Identifica inconsistencias y posibles errores sin intervención manual."],
      ["Analizar datos con IA", "Usa herramientas como Julius para obtener insights útiles sin ser analista técnico."],
    ],
    instructorsTitle: "Tus instructores",
    testimonialsTitle: "Qué dicen asistentes pasados",
    finalCta: "Conoce qué herramientas de IA puedes empezar a usar hoy para tu trabajo de trade compliance.",
  },
  zh: {
    tab: "大师课",
    badge: "即将开始",
    kicker: "Nextport AI 用户专属",
    title: "外贸与贸易合规 AI 实战课",
    subtitle: "Desteia 帮助团队用 AI 自动化合规工作。",
    date: "5月27日，星期三",
    time: "墨西哥城时间下午 6:30",
    format: "免费线上 webinar",
    promise: "你将学会如何用 AI 工具自动化实际的合规工作。",
    cta: "预约席位",
    reserved: "席位已预约。Zoom 链接和日历邀请将通过邮件发送。",
    included: "作为用户，你将在完成 training 后获得这节 master class，并可获得结业证书。",
    when: "时间",
    where: "地点",
    duration: "时长",
    whereValue: "Zoom 线上链接 + webinar 后发送回放",
    durationValue: "90 分钟",
    forYouTitle: "这节课适合你，如果：",
    forYou: [
      "你从事外贸或贸易合规工作。",
      "你有很多想自动化的重复任务。",
      "你想验证 AI 是否真的能帮助日常工作。",
      "你想尝试实用方法，而不是漫长的实施项目。",
    ],
    noTechnical: "不需要技术背景。会使用邮件和 Excel 即可参加。",
    learnTitle: "你将学到",
    learn: [
      ["用 ChatGPT 和 Zapier 审核并归类文件", "自动发现提单、发票、报关单和支持文件中的错误。"],
      ["自动创建电子档案", "集中管理文件，减少重复手工操作。"],
      ["自动审核 pedimentos", "无需人工逐项检查即可发现不一致和潜在错误。"],
      ["用 AI 分析数据", "使用 Julius 等工具获得洞察，无需成为技术分析师。"],
    ],
    instructorsTitle: "讲师",
    testimonialsTitle: "往期学员反馈",
    finalCta: "了解今天就能用于贸易合规工作的 AI 工具。",
  },
} as const;

const instructors = [
  {
    name: "Equipo Desteia",
    role: "Instructores invitados",
    bio: "Especialistas en implementación de IA para importaciones, visibilidad logística global y automatización práctica para equipos de comercio exterior.",
  },
  {
    name: "José Luis Sabau",
    role: "Chief of Staff Desteia",
    bio: "Licenciatura en Ciencias Políticas en Stanford. Maestría en Stanford. Especialista en implementación de IA para importaciones.",
  },
];

const testimonials = [
  {
    quote: "Sin Desteia, pagaríamos una fortuna en multas solo de Manifestación de Valor.",
    author: "Felix S.",
    role: "Imports Manager",
  },
  {
    quote: "Es la primera vez que una herramienta me quita trabajo en lugar de agregar. La Manifestación de Valor está bajo control gracias a Desteia.",
    author: "Gloria J.",
    role: "Foreign Trade Manager",
  },
  {
    quote: "La preocupación sobre la Manifestación de Valor ya no es un tema. Podemos enfocarnos en decisiones estratégicas en lugar de regulaciones cambiantes.",
    author: "Adriano T.",
    role: "Director de Trade Compliance",
  },
];

const tradeVaultCopy = {
  en: {
    tab: "Trade Radar",
    badge: "New video",
    badgeIdle: "Video vault",
    title: "Trade Radar",
    subtitle: "Curated episodes from Del Barco al Algoritmo for import, customs and trade compliance teams.",
    channel: "Del Barco al Algoritmo",
    source: "YouTube channel",
    recent: "Uploaded in the last 15 days",
    noRecent: "No uploads in the last 15 days",
    latest: "Latest episode",
    allVideos: "All channel videos",
    openYoutube: "Open on YouTube",
    embeddedBrowser: "Embedded video browser",
    loading: "Syncing channel feed...",
    fallback: "Using saved channel snapshot",
    live: "Live YouTube feed",
    views: "views",
  },
  es: {
    tab: "Radar de Comercio",
    badge: "Video nuevo",
    badgeIdle: "Vault de videos",
    title: "Radar de Comercio",
    subtitle: "Episodios curados de Del Barco al Algoritmo para equipos de importaciones, aduanas y trade compliance.",
    channel: "Del Barco al Algoritmo",
    source: "Canal de YouTube",
    recent: "Subido en los últimos 15 días",
    noRecent: "Sin videos nuevos en los últimos 15 días",
    latest: "Episodio más reciente",
    allVideos: "Todos los videos del canal",
    openYoutube: "Abrir en YouTube",
    embeddedBrowser: "Navegador de video integrado",
    loading: "Sincronizando feed del canal...",
    fallback: "Usando snapshot guardado del canal",
    live: "Feed de YouTube en vivo",
    views: "vistas",
  },
  zh: {
    tab: "贸易雷达",
    badge: "新视频",
    badgeIdle: "视频库",
    title: "贸易雷达",
    subtitle: "来自 Del Barco al Algoritmo 的精选内容，面向进口、海关和贸易合规团队。",
    channel: "Del Barco al Algoritmo",
    source: "YouTube 频道",
    recent: "最近 15 天内上传",
    noRecent: "最近 15 天没有新视频",
    latest: "最新节目",
    allVideos: "频道全部视频",
    openYoutube: "在 YouTube 打开",
    embeddedBrowser: "内嵌视频浏览器",
    loading: "正在同步频道 feed...",
    fallback: "使用已保存的频道快照",
    live: "实时 YouTube feed",
    views: "次观看",
  },
} as const;

const TRADE_VAULT_FALLBACK: TradeVideo[] = [
  {
    id: "Sp84PPn3chY",
    title: "Por qué hacer comercio exterior en México es difícil | Entrevista a Adrián Hernández",
    url: "https://www.youtube.com/watch?v=Sp84PPn3chY",
    embedUrl: "https://www.youtube.com/embed/Sp84PPn3chY",
    thumbnailUrl: "https://i4.ytimg.com/vi/Sp84PPn3chY/hqdefault.jpg",
    publishedAt: "2026-05-01T20:12:32+00:00",
    views: 122,
  },
  {
    id: "Boga4KKrHgE",
    title: "Así funcionan las aduanas en México | Entrevista a Sarah Flores",
    url: "https://www.youtube.com/watch?v=Boga4KKrHgE",
    embedUrl: "https://www.youtube.com/embed/Boga4KKrHgE",
    thumbnailUrl: "https://i3.ytimg.com/vi/Boga4KKrHgE/hqdefault.jpg",
    publishedAt: "2026-04-24T19:58:44+00:00",
    views: 817,
  },
  {
    id: "Nu_Ifs4NrUI",
    title: "El hombre detrás del comercio internacional de Pepsico en México",
    url: "https://www.youtube.com/watch?v=Nu_Ifs4NrUI",
    embedUrl: "https://www.youtube.com/embed/Nu_Ifs4NrUI",
    thumbnailUrl: "https://i3.ytimg.com/vi/Nu_Ifs4NrUI/hqdefault.jpg",
    publishedAt: "2026-04-14T16:45:06+00:00",
    views: 162,
  },
  {
    id: "t96NFg7Vdz0",
    title: "México es mucho mejor que EUA, Canadá y Latinoamérica | Líder regional de trade compliance",
    url: "https://www.youtube.com/watch?v=t96NFg7Vdz0",
    embedUrl: "https://www.youtube.com/embed/t96NFg7Vdz0",
    thumbnailUrl: "https://i1.ytimg.com/vi/t96NFg7Vdz0/hqdefault.jpg",
    publishedAt: "2026-03-15T23:35:09+00:00",
    views: 13,
  },
  {
    id: "VAjRRLmJYEU",
    title: "El comercio internacional va a cambiar en 2026 (y la gente no tiene ni idea)",
    url: "https://www.youtube.com/watch?v=VAjRRLmJYEU",
    embedUrl: "https://www.youtube.com/embed/VAjRRLmJYEU",
    thumbnailUrl: "https://i3.ytimg.com/vi/VAjRRLmJYEU/hqdefault.jpg",
    publishedAt: "2026-03-05T19:29:16+00:00",
    views: 135,
  },
  {
    id: "-ClvGsSTkOY",
    title: "Por qué aumentarán las multas a comercio exterior en México en 2026 | Consultor de aduanas",
    url: "https://www.youtube.com/watch?v=-ClvGsSTkOY",
    embedUrl: "https://www.youtube.com/embed/-ClvGsSTkOY",
    thumbnailUrl: "https://i2.ytimg.com/vi/-ClvGsSTkOY/hqdefault.jpg",
    publishedAt: "2026-02-27T19:27:11+00:00",
    views: 5,
  },
  {
    id: "a2ZxrODH09U",
    title: "Abogado de comercio exterior explica: cómo evitar millones en multas si importas a México",
    url: "https://www.youtube.com/watch?v=a2ZxrODH09U",
    embedUrl: "https://www.youtube.com/embed/a2ZxrODH09U",
    thumbnailUrl: "https://i2.ytimg.com/vi/a2ZxrODH09U/hqdefault.jpg",
    publishedAt: "2026-02-20T20:54:16+00:00",
    views: 18,
  },
  {
    id: "3gXNkIJ8zZA",
    title: "Cómo Bimbo logra estar en +91 países | La mujer detrás de su supply chain strategy",
    url: "https://www.youtube.com/watch?v=3gXNkIJ8zZA",
    embedUrl: "https://www.youtube.com/embed/3gXNkIJ8zZA",
    thumbnailUrl: "https://i4.ytimg.com/vi/3gXNkIJ8zZA/hqdefault.jpg",
    publishedAt: "2026-02-12T21:42:24+00:00",
    views: 116,
  },
  {
    id: "zcU7jjUgJHo",
    title: "Predicciones 2026 para el comercio exterior en México. NO TE VAN A GUSTAR",
    url: "https://www.youtube.com/watch?v=zcU7jjUgJHo",
    embedUrl: "https://www.youtube.com/embed/zcU7jjUgJHo",
    thumbnailUrl: "https://i3.ytimg.com/vi/zcU7jjUgJHo/hqdefault.jpg",
    publishedAt: "2026-02-07T02:05:20+00:00",
    views: 43,
  },
  {
    id: "RGQwmR3OXXE",
    title: "Trump vs. Maduro: esto pasará con el comercio exterior en México",
    url: "https://www.youtube.com/watch?v=RGQwmR3OXXE",
    embedUrl: "https://www.youtube.com/embed/RGQwmR3OXXE",
    thumbnailUrl: "https://i3.ytimg.com/vi/RGQwmR3OXXE/hqdefault.jpg",
    publishedAt: "2026-01-28T19:16:21+00:00",
    views: 255,
  },
];

function isRecentVideo(publishedAt: string, now = new Date(), days = 15) {
  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) return false;
  const diffMs = now.getTime() - published.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

function formatDate(value: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : lang === "es" ? "es-MX" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function AcademyDashboard() {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<AcademyFilter>("all");
  const [tutorOpen, setTutorOpen] = useState(false);
  const [masterClassReserved, setMasterClassReserved] = useState(false);
  const [tradeVaultVideos, setTradeVaultVideos] = useState<TradeVideo[]>(TRADE_VAULT_FALLBACK);
  const [selectedTradeVideoId, setSelectedTradeVideoId] = useState(TRADE_VAULT_FALLBACK[0].id);
  const [tradeVaultLoading, setTradeVaultLoading] = useState(false);
  const [tradeVaultLive, setTradeVaultLive] = useState(false);
  const master = masterClassCopy[lang];
  const trade = tradeVaultCopy[lang];
  const hasRecentTradeVideo = tradeVaultVideos.some((video) => isRecentVideo(video.publishedAt));

  const filtered = ACADEMY_LESSONS.filter((l) => {
    if (levelFilter === "masterclass" || levelFilter === "tradevault") return false;
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

  const minutesLabel = t("minutesShort", lang);

  useEffect(() => {
    let cancelled = false;

    async function loadTradeVault() {
      setTradeVaultLoading(true);
      try {
        const response = await fetch("/api/academy/trade-vault");
        if (!response.ok) return;
        const payload = await response.json();
        const videos = Array.isArray(payload.videos) ? payload.videos as TradeVideo[] : [];
        if (!cancelled && videos.length > 0) {
          setTradeVaultVideos(videos);
          setSelectedTradeVideoId((current) => videos.some((video) => video.id === current) ? current : videos[0].id);
          setTradeVaultLive(true);
        }
      } catch {
        if (!cancelled) setTradeVaultLive(false);
      } finally {
        if (!cancelled) setTradeVaultLoading(false);
      }
    }

    loadTradeVault();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium sm:w-auto"
          style={{ background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.25)" }}
        >
          <Bot size={14} />
          {t("askTutor", lang)}
        </button>
      </div>

      {/* Overall progress */}
      <div className="glass-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-soft)" }}>
          <GraduationCap size={20} style={{ color: "var(--brand)" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              {`${t("yourProgress", lang)} · ${completedCount}/${total} ${t("modulesCompleted", lang)}`}
            </p>
            <span className="text-sm font-mono" style={{ color: "var(--brand)" }}>{progressPct}%</span>
          </div>
          <ProgressBar value={progressPct} color="var(--brand)" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 sm:py-1.5"
          style={{ background: "var(--bg-2)", border: "1px solid var(--hair-2)" }}
        >
          <Search size={12} style={{ color: "var(--ink-4)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchModules", lang)}
            className="w-full bg-transparent text-xs outline-none sm:w-40"
            style={{ color: "var(--ink)" }}
          />
        </div>
        {(["all", "beginner", "intermediate", "advanced", "masterclass", "tradevault"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              levelFilter === l
                ? { background: "rgba(255,255,255,0.07)", color: "var(--ink)", border: "1px solid var(--hair-2)" }
                : l === "masterclass"
                  ? { color: "var(--risk)", border: "1px solid transparent" }
                  : l === "tradevault"
                    ? { color: hasRecentTradeVideo ? "var(--risk)" : "var(--brand)", border: "1px solid transparent" }
                  : { color: "var(--ink-4)", border: "1px solid transparent" }
            }
          >
            {l === "masterclass" && <Radio size={12} style={{ color: "var(--risk)" }} />}
            {l === "tradevault" && (hasRecentTradeVideo ? <AlertCircle size={12} style={{ color: "var(--risk)" }} /> : <LibraryBig size={12} />)}
            {l === "all" ? t("allLevels", lang) : l === "masterclass" ? master.tab : l === "tradevault" ? trade.tab : t(l, lang)}
          </button>
        ))}
      </div>

      {levelFilter === "masterclass" && (
        <MasterClassPanel
          copy={master}
          reserved={masterClassReserved}
          onReserve={() => setMasterClassReserved(true)}
        />
      )}

      {levelFilter === "tradevault" && (
        <TradeVaultPanel
          copy={trade}
          videos={tradeVaultVideos}
          selectedVideoId={selectedTradeVideoId}
          onSelectVideo={setSelectedTradeVideoId}
          hasRecent={hasRecentTradeVideo}
          loading={tradeVaultLoading}
          live={tradeVaultLive}
          lang={lang}
        />
      )}

      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        if (levelFilter === "masterclass" || levelFilter === "tradevault") return null;
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

function MasterClassPanel({
  copy,
  reserved,
  onReserve,
}: {
  copy: (typeof masterClassCopy)[keyof typeof masterClassCopy];
  reserved: boolean;
  onReserve: () => void;
}) {
  return (
    <section className="glass-panel overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ background: "var(--risk-soft)", color: "var(--risk)", border: "1px solid oklch(0.70 0.20 29 / 0.35)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--risk)", boxShadow: "0 0 14px var(--risk)" }} />
              {copy.badge}
            </span>
            <span className="chip chip-brand">
              <Award size={12} />
              {copy.kicker}
            </span>
          </div>

          <div className="max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-[0.22em]" style={{ color: "var(--ink-4)" }}>
              Desteia
            </p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl" style={{ color: "var(--ink)" }}>
              {copy.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-3)" }}>
              {copy.subtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <EventFact icon={<CalendarClock size={15} />} label={copy.when} value={`${copy.date} · ${copy.time}`} />
            <EventFact icon={<Radio size={15} />} label={copy.where} value={copy.whereValue} />
            <EventFact icon={<Clock size={15} />} label={copy.duration} value={copy.durationValue} />
          </div>

          <div className="rounded-2xl p-4" style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl p-2" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{copy.format}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--ink-3)" }}>{copy.promise}</p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--ink-4)" }}>{copy.included}</p>
              </div>
            </div>
          </div>

          {reserved && (
            <div className="flex items-start gap-2 rounded-2xl px-4 py-3 text-sm" style={{ background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid oklch(0.76 0.15 165 / 0.28)" }}>
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <span>{copy.reserved}</span>
            </div>
          )}

          <button onClick={onReserve} className="btn btn-primary w-full justify-center sm:w-auto">
            {reserved ? <CheckCircle2 size={14} /> : <CalendarClock size={14} />}
            {copy.cta}
          </button>
        </div>

        <div className="space-y-4 border-t p-5 sm:p-6 lg:border-l lg:border-t-0" style={{ borderColor: "var(--hair)" }}>
          <InfoBlock title={copy.forYouTitle}>
            <ul className="space-y-2">
              {copy.forYou.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed" style={{ color: "var(--ink-3)" }}>
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--ok)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--ink-4)" }}>{copy.noTechnical}</p>
          </InfoBlock>

          <InfoBlock title={copy.learnTitle}>
            <div className="space-y-3">
              {copy.learn.map(([title, body], index) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-mono" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--ink-4)" }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoBlock>

          <InfoBlock title={copy.instructorsTitle}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {instructors.map((instructor) => (
                <div key={instructor.name} className="rounded-2xl p-3" style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--hair)", color: "var(--ink)" }}>
                      <Users size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{instructor.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--ink-4)" }}>{instructor.role}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--ink-4)" }}>{instructor.bio}</p>
                </div>
              ))}
            </div>
          </InfoBlock>

          <InfoBlock title={copy.testimonialsTitle}>
            <div className="space-y-2">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.author} className="rounded-2xl p-3" style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>&ldquo;{testimonial.quote}&rdquo;</p>
                  <footer className="mt-2 text-[11px]" style={{ color: "var(--ink-4)" }}>
                    <span style={{ color: "var(--ink)" }}>{testimonial.author}</span> · {testimonial.role}
                  </footer>
                </blockquote>
              ))}
            </div>
          </InfoBlock>

          <p className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.25)" }}>
            {copy.finalCta}
          </p>
        </div>
      </div>
    </section>
  );
}

function TradeVaultPanel({
  copy,
  videos,
  selectedVideoId,
  onSelectVideo,
  hasRecent,
  loading,
  live,
  lang,
}: {
  copy: (typeof tradeVaultCopy)[keyof typeof tradeVaultCopy];
  videos: TradeVideo[];
  selectedVideoId: string;
  onSelectVideo: (id: string) => void;
  hasRecent: boolean;
  loading: boolean;
  live: boolean;
  lang: string;
}) {
  const selectedVideo = videos.find((video) => video.id === selectedVideoId) ?? videos[0];
  const latestVideo = videos[0];

  return (
    <section className="glass-panel overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: hasRecent ? "var(--risk-soft)" : "var(--brand-soft)",
                color: hasRecent ? "var(--risk)" : "var(--brand)",
                border: hasRecent ? "1px solid oklch(0.70 0.20 29 / 0.35)" : "1px solid oklch(0.78 0.09 235 / 0.25)",
              }}
            >
              {hasRecent ? <AlertCircle size={12} /> : <LibraryBig size={12} />}
              {hasRecent ? copy.badge : copy.badgeIdle}
            </span>
            <span className="chip chip-neutral">
              <span className="dot" />
              {loading ? copy.loading : live ? copy.live : copy.fallback}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em]" style={{ color: "var(--ink-4)" }}>
                {copy.channel}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl" style={{ color: "var(--ink)" }}>
                {copy.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-3)" }}>
                {copy.subtitle}
              </p>
            </div>
            <a
              className="btn w-full justify-center sm:w-auto"
              href="https://www.youtube.com/@delbarcoalalgoritmo"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              {copy.source}
            </a>
          </div>

          {selectedVideo && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em]" style={{ color: "var(--ink-4)" }}>
                    {copy.embeddedBrowser}
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--ink)" }}>
                    {selectedVideo.title}
                  </p>
                </div>
                <a className="hidden text-xs sm:inline-flex" href={selectedVideo.url} target="_blank" rel="noreferrer" style={{ color: "var(--brand)" }}>
                  {copy.openYoutube}
                </a>
              </div>

              <div className="overflow-hidden rounded-2xl" style={{ background: "black", border: "1px solid var(--hair-2)" }}>
                <iframe
                  key={selectedVideo.id}
                  className="aspect-video w-full"
                  src={selectedVideo.embedUrl}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--ink-4)" }}>
                <span>{formatDate(selectedVideo.publishedAt, lang)}</span>
                {typeof selectedVideo.views === "number" && selectedVideo.views > 0 && (
                  <>
                    <span>·</span>
                    <span>{selectedVideo.views.toLocaleString(lang === "zh" ? "zh-CN" : lang === "es" ? "es-MX" : "en-US")} {copy.views}</span>
                  </>
                )}
                <span>·</span>
                <span style={{ color: isRecentVideo(selectedVideo.publishedAt) ? "var(--risk)" : "var(--ink-4)" }}>
                  {isRecentVideo(selectedVideo.publishedAt) ? copy.recent : copy.noRecent}
                </span>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 border-t p-5 sm:p-6 xl:border-l xl:border-t-0" style={{ borderColor: "var(--hair)" }}>
          {latestVideo && (
            <div className="rounded-2xl p-4" style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em]" style={{ color: "var(--ink-4)" }}>
                <PlayCircle size={13} style={{ color: "var(--brand)" }} />
                {copy.latest}
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: "var(--ink)" }}>
                {latestVideo.title}
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--ink-4)" }}>
                {formatDate(latestVideo.publishedAt, lang)}
              </p>
            </div>
          )}

          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: "var(--ink)" }}>
              {copy.allVideos}
            </h4>
            <div className="space-y-2">
              {videos.map((video) => {
                const active = video.id === selectedVideo?.id;
                const recent = isRecentVideo(video.publishedAt);

                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => onSelectVideo(video.id)}
                    className="grid w-full grid-cols-[74px_1fr] gap-3 rounded-2xl p-2 text-left transition-all hover:-translate-y-0.5"
                    style={{
                      background: active ? "var(--surface-active)" : "var(--bg-2)",
                      border: active ? "1px solid var(--border-strong)" : "1px solid var(--hair)",
                      boxShadow: active ? "var(--elev-2)" : undefined,
                    }}
                  >
                    <div
                      className="relative overflow-hidden rounded-xl bg-cover bg-center"
                      style={{ backgroundColor: "var(--bg)", backgroundImage: `url(${video.thumbnailUrl})` }}
                    >
                      <div className="aspect-video w-full" />
                      <span className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.20)", color: "white" }}>
                        <PlayCircle size={18} />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {recent && <AlertCircle size={11} style={{ color: "var(--risk)" }} />}
                        <p className="line-clamp-2 text-xs font-semibold leading-snug" style={{ color: "var(--ink)" }}>
                          {video.title}
                        </p>
                      </div>
                      <p className="mt-1 text-[11px]" style={{ color: "var(--ink-4)" }}>
                        {formatDate(video.publishedAt, lang)}
                      </p>
                      <p className="mt-1 truncate text-[10.5px] font-mono" style={{ color: "var(--ink-4)" }}>
                        {video.url}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function EventFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: "var(--bg-2)", border: "1px solid var(--hair)" }}>
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em]" style={{ color: "var(--ink-4)" }}>
        <span style={{ color: "var(--brand)" }}>{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm leading-snug" style={{ color: "var(--ink)" }}>{value}</p>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold" style={{ color: "var(--ink)" }}>{title}</h4>
      {children}
    </div>
  );
}
