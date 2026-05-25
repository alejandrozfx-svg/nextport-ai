"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Toast } from "./Toast";

/* Toast system (ADR-0002 A1).
 * Global provider wired in app/layout.tsx. Call useToast().push({...}) anywhere.
 * Auto-dismiss after 4s by default. Animations live in globals.css (.toast-in / .toast-out)
 * gated by prefers-reduced-motion: no-preference. */

export type ToastTone = "ok" | "warn" | "risk" | "brand";

export interface ToastInput {
  tone?: ToastTone;
  title: React.ReactNode;
  detail?: React.ReactNode;
  duration?: number; // ms, default 4000
}

interface ActiveToast extends ToastInput {
  id: string;
  exiting?: boolean;
}

interface ToastContextValue {
  push: (input: ToastInput) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ push: () => {}, dismiss: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { ...input, id }]);
      const duration = input.duration ?? 4000;
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-[320px] max-w-[calc(100vw-32px)] ${t.exiting ? "toast-out" : "toast-in"}`}
          >
            <Toast tone={t.tone ?? "brand"} title={t.title} detail={t.detail} onClose={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
