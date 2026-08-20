"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { MessageSquare } from "lucide-react";

export default function AdminChatPage() {
  const { data: session } = useSession();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  const adminId = session?.user?.id || "";
  const adminName = session?.user?.name || "Admin";

  const handleSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
    setIsMobileListOpen(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold text-charcoal mb-4">Messages</h1>
      <div className="flex h-[calc(100%-3rem)] bg-white rounded-xl border border-border overflow-hidden">
        {/* Conversation List - Sidebar */}
        <div
          className={`w-80 border-r border-border shrink-0 overflow-y-auto ${
            activeConversation && !isMobileListOpen ? "hidden md:block" : "block"
          }`}
        >
          <ConversationList
            activeConversationId={activeConversation}
            onSelect={handleSelect}
          />
        </div>

        {/* Chat Panel */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            !activeConversation || isMobileListOpen ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConversation ? (
            <ChatPanel
              conversationId={activeConversation}
              currentUserId={`admin:${adminId}`}
              currentUserName={adminName}
              onBack={() => {
                setActiveConversation(null);
                setIsMobileListOpen(true);
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
