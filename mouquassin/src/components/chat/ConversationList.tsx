"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, RefreshCw } from "lucide-react";

interface Conversation {
  conversationId: string;
  customerName: string;
  customerEmail: string;
  latestMessage: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface ConversationListProps {
  activeConversationId: string | null;
  onSelect: (conversationId: string) => void;
}

export function ConversationList({
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    async function load() {
      try {
        const res = await fetch("/api/conversations");
        if (res.ok && !cancelledRef.current) {
          const data: Conversation[] = await res.json();
          setConversations(data);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelledRef.current = true;
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data: Conversation[] = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Loading conversations...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
        No conversations yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium">Conversations</h3>
        <button
          onClick={handleRefresh}
          className="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="overflow-y-auto">
        {conversations.map((conv) => {
          const isActive = conv.conversationId === activeConversationId;
          return (
            <button
              key={conv.conversationId}
              onClick={() => onSelect(conv.conversationId)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors ${
                isActive ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">
                  {conv.customerName}
                </span>
                <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                  {formatTime(conv.latestMessage.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">
                  {conv.latestMessage.senderId.startsWith("admin:")
                    ? "You: "
                    : ""}
                  {conv.latestMessage.content}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 shrink-0 bg-burgundy text-cream text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
