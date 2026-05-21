import { Bot, User, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedLessons?: string[];
  suggestedAction?: string;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export function AssistantMessage({ message }: { message: MessageData }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: isUser ? "var(--hair)" : "var(--brand-soft)",
          marginTop: 2,
        }}
      >
        {isUser ? (
          <User size={12} style={{ color: "var(--ink-3)" }} />
        ) : (
          <Bot size={12} style={{ color: "var(--brand)" }} />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <div
          className="px-3 py-2.5 rounded-xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: "var(--brand-soft)",
                  color: "var(--ink)",
                  border: "1px solid oklch(0.78 0.09 235 / 0.2)",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--ink-2)",
                  border: "1px solid var(--hair)",
                }
          }
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />

        {/* Suggested action */}
        {message.suggestedAction && (
          <div
            className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
            style={{ background: "var(--warn-soft)", color: "var(--warn)", border: "1px solid oklch(0.82 0.14 78 / 0.2)" }}
          >
            <ArrowRight size={11} />
            {message.suggestedAction}
          </div>
        )}

        {/* Related lessons */}
        {message.relatedLessons && message.relatedLessons.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <BookOpen size={11} style={{ color: "var(--ink-4)" }} />
            {message.relatedLessons.map((id) => (
              <Link
                key={id}
                href={`/console/academy/${id}`}
                className="text-xs px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
              >
                {id}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
