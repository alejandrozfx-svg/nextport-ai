"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { LangProvider } from "@/lib/lang-context";

interface ConsoleShellProps {
  children: React.ReactNode;
}

export function ConsoleShell({ children }: ConsoleShellProps) {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <LangProvider>
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Sidebar onAiClick={() => setAiOpen(true)} />
        <TopBar onScan={() => {}} />
        <main
          style={{
            marginLeft: 240,
            paddingTop: 56,
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
        {aiOpen && <AssistantPanel onClose={() => setAiOpen(false)} />}
      </div>
    </LangProvider>
  );
}
