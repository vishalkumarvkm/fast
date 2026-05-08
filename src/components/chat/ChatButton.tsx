"use client";

import { useAppStore } from "@/store/appStore";
import { AskAgentButton } from "./AskAgentButton";

export function ChatButton() {
  const { isChatOpen, unreadChatCount } = useAppStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      {/* Pulse effect for proactive suggestions */}
      {!isChatOpen && unreadChatCount > 0 && (
        <div className="absolute -inset-1 bg-primary/30 rounded-full animate-ping pointer-events-none" />
      )}
      
      <AskAgentButton />
    </div>
  );
}
