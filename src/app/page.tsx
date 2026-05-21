"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Instagram,
  Shield,
  User,
} from "lucide-react";

const VIDEO_SOURCES = ["/assets/tracker.mp4"];

const MARKETING_ROUTES = {
  platform: "/platform",
  compliance: "/compliance",
  integrations: "/integrations",
  pricing: "/pricing",
} as const;

const LANGS = [
  ["en", "EN"],
  ["es", "ES"],
  ["zh", "中"],
] as const;

type Lang = (typeof LANGS)[number][0];
type SignInStage = "email" | "password" | "reset" | "reset_sent" | "success";

const I18N: Record<Lang, Record<string, string>> = {
  en: {
    platform: "Platform",
    compliance: "Compliance",
    integrations: "Integrations",
    pricing: "Pricing",
    enter_console: "Enter console",
    headline: "AI control tower for import compliance.",
    sub: "Nextport AI turns pedimentos, invoices, BLs, packing lists and MVE documents into audit-ready import operations — extraction, cross-check and human approval in one workspace.",
    trust_line: "Built for compliance analysts, import coordinators and operations leaders.",
    sign_in: "Sign in",
    continue: "Continue",
    email_error: "Enter your email to continue.",
    email_invalid: "That doesn't look like a valid email.",
    password_hint: "Enter password to continue",
    password_placeholder: "Password",
    password_error: "Enter your password.",
    password_wrong: "Incorrect password. Try again or reset it below.",
    remember: "Remember this device",
    forgot: "Forgot password?",
    change: "Change",
    show: "Show",
    hide: "Hide",
    reset_title: "Reset your password",
    account_email: "Account email",
    reset_error: "Enter the email tied to your account.",
    reset_send: "Send reset link",
    reset_sending: "Sending...",
    reset_hint: "We'll send instructions to your registered email.",
    reset_sent: "Reset link sent",
    reset_sent_hint: "Check {email} for instructions.",
    reset_back: "Back to sign in",
    reset_resend: "Didn't arrive? Resend in 30s",
    welcome: "Welcome back, Alejandro",
    loading: "Loading your console...",
  },
  es: {
    platform: "Plataforma",
    compliance: "Cumplimiento",
    integrations: "Integraciones",
    pricing: "Precios",
    enter_console: "Entrar a consola",
    headline: "Torre de control IA para import compliance.",
    sub: "Nextport AI convierte pedimentos, facturas, BL, packing lists y MVE en operaciones listas para auditoría — extracción, cruce y aprobación humana en un solo workspace.",
    trust_line: "Hecho para analistas de cumplimiento, coordinadores de importación y líderes de operaciones.",
    sign_in: "Iniciar sesión",
    continue: "Continuar",
    email_error: "Ingresa tu correo para continuar.",
    email_invalid: "Ese correo no parece válido.",
    password_hint: "Ingresa tu contraseña para continuar",
    password_placeholder: "Contraseña",
    password_error: "Ingresa tu contraseña.",
    password_wrong: "Contraseña incorrecta. Intenta otra vez o restablécela abajo.",
    remember: "Recordar este dispositivo",
    forgot: "¿Olvidaste tu contraseña?",
    change: "Cambiar",
    show: "Mostrar",
    hide: "Ocultar",
    reset_title: "Restablece tu contraseña",
    account_email: "Correo de la cuenta",
    reset_error: "Ingresa el correo asociado a tu cuenta.",
    reset_send: "Enviar enlace",
    reset_sending: "Enviando...",
    reset_hint: "Enviaremos instrucciones a tu correo registrado.",
    reset_sent: "Enlace enviado",
    reset_sent_hint: "Revisa {email} para ver las instrucciones.",
    reset_back: "Volver a iniciar sesión",
    reset_resend: "¿No llegó? Reenviar en 30s",
    welcome: "Bienvenido de vuelta, Alejandro",
    loading: "Cargando tu consola...",
  },
  zh: {
    platform: "平台",
    compliance: "合规",
    integrations: "集成",
    pricing: "价格",
    enter_console: "进入控制台",
    headline: "进口合规的 AI 控制塔。",
    sub: "Nextport AI 将报关单、发票、提单、装箱单和 MVE 文件转化为可审计的进口业务 — 在一个工作区完成提取、交叉核对与人工审批。",
    trust_line: "为合规分析师、进口协调员和运营负责人打造。",
    sign_in: "登录",
    continue: "继续",
    email_error: "请输入邮箱继续。",
    email_invalid: "邮箱格式似乎不正确。",
    password_hint: "输入密码继续",
    password_placeholder: "密码",
    password_error: "请输入密码。",
    password_wrong: "密码不正确。请重试或重置。",
    remember: "记住此设备",
    forgot: "忘记密码？",
    change: "更改",
    show: "显示",
    hide: "隐藏",
    reset_title: "重置密码",
    account_email: "账户邮箱",
    reset_error: "请输入账户绑定的邮箱。",
    reset_send: "发送重置链接",
    reset_sending: "发送中...",
    reset_hint: "我们会把说明发送到你的注册邮箱。",
    reset_sent: "重置链接已发送",
    reset_sent_hint: "请查看 {email} 获取说明。",
    reset_back: "返回登录",
    reset_resend: "没收到？30 秒后重发",
    welcome: "欢迎回来，Alejandro",
    loading: "正在加载控制台...",
  },
};

function t(lang: Lang, key: string) {
  return I18N[lang][key] ?? I18N.en[key] ?? key;
}

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const savedLang = window.localStorage.getItem("np_lang");
    if (savedLang === "en" || savedLang === "es" || savedLang === "zh") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--brand", "#7AB0E0");
    document.documentElement.style.setProperty("--brand-soft", "#7AB0E024");
    document.documentElement.style.setProperty("--glass-tint", "14px");
  }, []);

  const fadeVideoTo = useCallback((target: number, duration = 500, onDone?: () => void) => {
    const video = videoRef.current;
    if (!video) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = performance.now();
    const from = Number.parseFloat(video.style.opacity || "1");
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      video.style.opacity = String(from + (target - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        onDone?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return undefined;

    const onLoaded = () => {
      setVideoReady(true);
      video.play().catch(() => undefined);
      fadingOutRef.current = false;
      fadeVideoTo(1, 500);
    };

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeVideoTo(0, 500);
      }
    };

    const onEnded = () => {
      video.style.opacity = "0";
      window.setTimeout(() => {
        try {
          video.currentTime = 0;
        } catch {
          return;
        }
        video.play().catch(() => undefined);
        fadingOutRef.current = false;
        fadeVideoTo(1, 500);
      }, 100);
    };

    const onError = () => {
      setVideoEnabled(false);
      setVideoReady(false);
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    if (video.readyState >= 2) onLoaded();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [fadeVideoTo, videoEnabled]);

  function enterConsole() {
    window.localStorage.setItem("np_lang", lang);
    window.localStorage.setItem(
      "np_user",
      JSON.stringify({
        name: "Alejandro Reyes",
        initials: "AR",
        role: "Product Demo Owner",
        email: "alejandrozfx@gmail",
      }),
    );
    router.push("/console");
  }

  return (
    <main
      id="landing"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#000" }}
      data-screen-label="01 Landing"
    >
      {videoEnabled ? (
        <video
          ref={videoRef}
          className="hero-vid"
          autoPlay
          muted
          playsInline
          preload="auto"
          src={VIDEO_SOURCES[0]}
          style={{ opacity: videoReady ? 1 : 0 }}
        />
      ) : (
        <HeroFallback />
      )}
      {!videoReady && videoEnabled && <HeroFallback />}
      <div className="hero-vignette" />

      <nav className="relative z-20 px-4 py-5 sm:px-6 sm:py-6">
        <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-5 lg:gap-8">
            <a
              href="#landing"
              aria-label="Nextport AI home"
              className="flex shrink-0 items-center gap-2.5"
            >
              <BrandMark size={24} />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Nextport <span style={{ color: "var(--ink-3)" }}>AI</span>
              </span>
            </a>

            <div className="hidden items-center gap-7 text-[13px] md:flex">
              {(["platform", "compliance", "integrations", "pricing"] as const).map((item) => (
                <Link
                  key={item}
                  href={MARKETING_ROUTES[item]}
                  className="cursor-pointer text-white/75 transition-colors hover:text-white"
                >
                  {t(lang, item)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LangPill lang={lang} setLang={setLang} />
            <button
              type="button"
              onClick={enterConsole}
              className="liquid-glass hidden rounded-full px-5 py-1.5 text-[13px] font-medium text-white sm:flex sm:items-center sm:gap-1.5"
            >
              {t(lang, "enter_console")}
              <ArrowRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </nav>

      <section
        className="relative z-10 flex flex-col items-center justify-center px-5 pb-8 pt-8 text-center sm:px-6 sm:pt-10"
        style={{ transform: "translateY(-4%)" }}
      >
        <h1 className="hero-title fade-up max-w-[1100px] text-white">
          {t(lang, "headline")}
        </h1>

        <p className="fade-up mt-7 max-w-[640px] text-[15px] leading-relaxed text-white/65 md:text-[16px]">
          {t(lang, "sub")}
        </p>

        <div className="fade-up mt-9 w-full max-w-xl space-y-4">
          <SignInCard lang={lang} onSuccess={enterConsole} />
          <p className="px-4 text-[12.5px] leading-relaxed text-white/55">
            {t(lang, "trust_line")}
          </p>
        </div>

        <div className="fade-up mt-12 hidden items-center gap-7 text-[11px] uppercase tracking-widest text-white/45 sm:flex">
          <span>SAT · VUCEM</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>SAP · Oracle · Netsuite</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>SOC 2 Type II</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>ISO 27001</span>
        </div>
      </section>

      <div className="relative z-10 flex justify-center gap-3 pb-10">
        <button
          type="button"
          aria-label="Instagram"
          className="liquid-glass rounded-full p-3.5 text-white/75 transition-colors hover:text-white"
        >
          <Instagram size={18} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          aria-label="X"
          className="liquid-glass rounded-full p-3.5 text-white/75 transition-colors hover:text-white"
        >
          <XIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Website"
          className="liquid-glass rounded-full p-3.5 text-white/75 transition-colors hover:text-white"
        >
          <Globe size={18} strokeWidth={1.6} />
        </button>
      </div>
    </main>
  );
}

function LangPill({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  return (
    <div className="liquid-glass flex items-center rounded-full p-0.5">
      {LANGS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            setLang(key);
            window.localStorage.setItem("np_lang", key);
          }}
          className="rounded-full px-2.5 py-1 text-[11px] transition-colors"
          style={{
            color: lang === key ? "#0A0D12" : "rgba(255,255,255,0.8)",
            background: lang === key ? "rgba(255,255,255,0.92)" : "transparent",
            fontWeight: 600,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SignInCard({
  lang,
  onSuccess,
}: {
  lang: Lang;
  onSuccess: () => void;
}) {
  const [stage, setStage] = useState<SignInStage>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validUsers = [
    { email: "alejandrozfx@gmail", password: "123456" },
    { email: "demo@nextport.ai", password: "demo123" },
  ];

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+(\.[^\s@]+)?$/.test(value.trim());

  function submitEmail(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(t(lang, "email_error"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t(lang, "email_invalid"));
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setStage("password");
    }, 350);
  }

  function submitPassword(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError(null);
    if (!password) {
      setError(t(lang, "password_error"));
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      const match = validUsers.some(
        (user) => user.email === email.trim().toLowerCase() && user.password === password,
      );
      if (match) {
        setStage("success");
        window.setTimeout(onSuccess, 650);
      } else {
        setError(t(lang, "password_wrong"));
      }
    }, 500);
  }

  function submitReset(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError(t(lang, "reset_error"));
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setStage("reset_sent");
    }, 500);
  }

  if (stage === "success") {
    return (
      <div className="liquid-glass fade-up flex items-center gap-3 rounded-2xl px-6 py-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background: "var(--ok-soft)",
            border: "1px solid oklch(0.78 0.13 155 / 0.5)",
          }}
        >
          <Check size={16} strokeWidth={2.4} style={{ color: "var(--ok)" }} />
        </div>
        <div className="text-left">
          <div className="text-[14px] text-white">{t(lang, "welcome")}</div>
          <div className="text-[12px] text-white/60">{t(lang, "loading")}</div>
        </div>
      </div>
    );
  }

  if (stage === "reset_sent") {
    return (
      <div className="liquid-glass fade-up rounded-2xl px-6 py-5">
        <div className="mb-2 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              background: "var(--ok-soft)",
              border: "1px solid oklch(0.78 0.13 155 / 0.5)",
            }}
          >
            <Check size={15} strokeWidth={2.4} style={{ color: "var(--ok)" }} />
          </div>
          <div className="text-left">
            <div className="text-[14px] text-white">{t(lang, "reset_sent")}</div>
            <div className="text-[12px] text-white/60">
              {t(lang, "reset_sent_hint").replace("{email}", email.trim())}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t pt-3" style={{ borderColor: "var(--hair)" }}>
          <button
            type="button"
            onClick={() => {
              setStage("email");
              setError(null);
              setPassword("");
            }}
            className="flex items-center gap-1.5 text-[12.5px] text-white/70 hover:text-white"
          >
            <ArrowLeft size={12} strokeWidth={1.8} />
            {t(lang, "reset_back")}
          </button>
          <span className="ml-auto text-[11px] text-white/30">{t(lang, "reset_resend")}</span>
        </div>
      </div>
    );
  }

  if (stage === "reset") {
    return (
      <form onSubmit={submitReset} className="liquid-glass fade-up rounded-2xl px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] text-white">{t(lang, "reset_title")}</div>
          <button
            type="button"
            onClick={() => {
              setStage("email");
              setError(null);
            }}
            className="flex items-center gap-1 text-[11.5px] text-white/60 hover:text-white"
          >
            <ArrowLeft size={11} strokeWidth={1.8} />
            {t(lang, "reset_back")}
          </button>
        </div>
        <div
          className="mb-2 flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--hair-2)" }}
        >
          <User size={13} className="opacity-60" />
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t(lang, "account_email")}
            className="flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
          />
        </div>
        {error && (
          <div className="mb-2 px-1 text-[11.5px]" style={{ color: "oklch(0.86 0.10 25)" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary mt-1 w-full justify-center"
          style={submitting ? { opacity: 0.7 } : undefined}
        >
          {submitting ? t(lang, "reset_sending") : t(lang, "reset_send")}
          {!submitting && <ArrowRight size={13} strokeWidth={2} />}
        </button>
        <div className="mt-3 text-center text-[11px] text-white/45">{t(lang, "reset_hint")}</div>
      </form>
    );
  }

  if (stage === "password") {
    return (
      <form onSubmit={submitPassword} className="liquid-glass fade-up rounded-2xl px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--hair-2)" }}
            >
              <User size={12} className="opacity-80" />
            </div>
            <div className="min-w-0 text-left">
              <div className="truncate text-[12.5px] text-white">{email}</div>
              <div className="text-[10.5px] text-white/50">{t(lang, "password_hint")}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setStage("email");
              setError(null);
              setPassword("");
            }}
            className="text-[11.5px] text-white/60 hover:text-white"
          >
            {t(lang, "change")}
          </button>
        </div>
        <div
          className="flex items-center gap-2 rounded-full py-1.5 pl-4 pr-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "oklch(0.70 0.16 25 / 0.55)" : "var(--hair-2)"}`,
          }}
        >
          <Shield size={13} className="opacity-60" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t(lang, "password_placeholder")}
            autoFocus
            className="flex-1 bg-transparent py-1.5 text-[14px] text-white outline-none placeholder:text-white/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="px-2 py-1 text-[11px] text-white/55 hover:text-white"
          >
            {showPassword ? t(lang, "hide") : t(lang, "show")}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center rounded-full bg-white p-2.5 text-black"
            style={submitting ? { opacity: 0.6 } : undefined}
            aria-label={t(lang, "continue")}
          >
            {submitting ? <SpinnerDot dark /> : <ArrowRight size={16} strokeWidth={2} />}
          </button>
        </div>
        {error && (
          <div className="mt-2.5 flex items-center gap-2 px-1 text-[12px]" style={{ color: "oklch(0.86 0.10 25)" }}>
            <AlertTriangle size={12} />
            {error}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between px-1 text-[11.5px]">
          <label className="flex cursor-pointer items-center gap-1.5 text-white/55">
            <input type="checkbox" className="accent-white" />
            {t(lang, "remember")}
          </label>
          <button
            type="button"
            onClick={() => {
              setStage("reset");
              setError(null);
              setPassword("");
            }}
            className="text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            {t(lang, "forgot")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submitEmail} className="space-y-2">
      <div
        className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2"
        style={{
          boxShadow: error
            ? "0 0 0 1px oklch(0.70 0.16 25 / 0.5), inset 0 1px 1px rgba(255,255,255,0.10)"
            : undefined,
        }}
      >
        <input
          type="text"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          placeholder={t(lang, "sign_in")}
          autoComplete="email"
          className="flex-1 bg-transparent text-[14.5px] text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center rounded-full bg-white p-3 text-black"
          style={submitting ? { opacity: 0.6 } : undefined}
          aria-label={t(lang, "continue")}
        >
          {submitting ? <SpinnerDot dark /> : <ArrowRight size={18} strokeWidth={2} />}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 px-4 text-[12px]" style={{ color: "oklch(0.86 0.10 25)" }}>
          <AlertTriangle size={12} />
          {error}
        </div>
      )}
    </form>
  );
}

function HeroFallback() {
  return (
    <div className="hero-vid hero-fallback" aria-hidden="true">
      <div className="hero-fallback__map" />
      <div className="hero-fallback__route" />
      <div className="hero-fallback__pulse" />
    </div>
  );
}

function BrandMark({ size = 28 }: { size?: number }) {
  return <span className="brand-mark block" style={{ width: size, height: size }} />;
}

function SpinnerDot({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full"
      style={{
        border: `2px solid ${dark ? "rgba(10,13,18,0.3)" : "rgba(255,255,255,0.3)"}`,
        borderTopColor: dark ? "#0A0D12" : "#fff",
      }}
    />
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  );
}
