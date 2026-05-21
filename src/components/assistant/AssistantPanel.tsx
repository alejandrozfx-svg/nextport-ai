"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { AssistantMessage } from "./AssistantMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedLessons?: string[];
  suggestedAction?: string;
}

const quickPrompts = [
  "What is MVE and how does it affect my import?",
  "Why does BL weight matter for customs?",
  "Explain commercial vs customs value",
  "When should I escalate an operation?",
  "What documents are required for a pedimento?",
  "How does country of origin affect duties?",
];

interface AssistantPanelProps {
  onClose: () => void;
  context?: string;
}

export function AssistantPanel({ onClose, context }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm the **Nextport Tutor**, your AI guide for Mexican import compliance. I can help you understand pedimento requirements, HS classification, SAT regulations, and more. What would you like to know?",
      relatedLessons: ["mod-01"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const messageText = text ?? input.trim();
    if (!messageText || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, context }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        relatedLessons: data.relatedLessons,
        suggestedAction: data.suggestedAction,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed right-0 top-0 h-screen flex flex-col fade-up"
      style={{
        width: 380,
        background: "var(--bg-2)",
        borderLeft: "1px solid var(--hair)",
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--hair)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "var(--brand-soft)" }}
        >
          <Bot size={14} style={{ color: "var(--brand)" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
            Nextport Tutor
          </p>
          <p className="text-xs" style={{ color: "var(--ink-4)" }}>
            Trade Compliance AI
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80"
          style={{ border: "1px solid var(--hair)" }}
        >
          <X size={14} style={{ color: "var(--ink-3)" }} />
        </button>
      </div>

      {/* Context chip */}
      {context && (
        <div className="px-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid var(--hair)" }}>
          <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs"
            style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
          >
            <Sparkles size={10} />
            Context: {context}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <AssistantMessage key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--brand-soft)" }}
            >
              <Bot size={12} style={{ color: "var(--brand)" }} />
            </div>
            <div
              className="px-3 py-2 rounded-xl shimmer"
              style={{ width: 120, height: 36, borderRadius: 12 }}
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--hair)" }}>
          <p className="text-xs mb-2 font-medium" style={{ color: "var(--ink-4)" }}>
            QUICK PROMPTS
          </p>
          <div className="space-y-1.5">
            {quickPrompts.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: "var(--hair)", color: "var(--ink-3)", border: "1px solid var(--hair-2)" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0" style={{ borderTop: "1px solid var(--hair)" }}>
        <div
          className="flex items-end gap-2 rounded-xl p-3"
          style={{ background: "var(--bg)", border: "1px solid var(--hair-2)" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about import compliance…"
            rows={2}
            className="flex-1 bg-transparent text-sm outline-none resize-none"
            style={{ color: "var(--ink)", caretColor: "var(--brand)" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
            style={{ background: "var(--brand)" }}
          >
            <Send size={13} style={{ color: "#0A0D12" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
