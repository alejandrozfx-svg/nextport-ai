"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { UploadModal } from "@/components/operations/UploadModal";
import { LangProvider } from "@/lib/lang-context";

interface ConsoleShellProps {
  children: React.ReactNode;
}

export function ConsoleShell({ children }: ConsoleShellProps) {
  const [aiOpen, setAiOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  return (
    <LangProvider>
      <div className="console-shell">
        <Sidebar onAiClick={() => setAiOpen(true)} />
        <TopBar onScan={() => setScanOpen(true)} />
        <main className="console-main">
          {children}
        </main>
        {aiOpen && <AssistantPanel onClose={() => setAiOpen(false)} />}
        {scanOpen && <UploadModal onClose={() => setScanOpen(false)} />}
      </div>
    </LangProvider>
  );
}
