"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useSocket, type MessageEvent } from "@/hooks/useSocket";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  status: "delivered" | "read";
  createdAt: string;
}

interface ChatPanelProps {
  conversationId: string;
  currentUserId: string;
  currentUserName: string;
  onBack?: () => void;
}

export function ChatPanel({
  conversationId,
  currentUserId,
  currentUserName,
  onBack,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const renderedIdsRef = useRef<Set<string>>(new Set());
  const fetchedRef = useRef(false);

  const { on, connectionState } = useSocket(conversationId);

  // Fetch latest 25 messages
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversationId}`
        );
        if (res.ok && !cancelled) {
          const data: Message[] = await res.json();
          setMessages(data);
          data.forEach((m) => renderedIdsRef.current.add(m.id));
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      load();
    }
    return () => { cancelled = true; };
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    const unsub = on("message_received", (data) => {
      const msg = data as unknown as MessageEvent;
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        const newMsg: Message = {
          id: msg.id,
          senderId: msg.senderId,
          senderName: msg.senderName,
          content: msg.content,
          status: "delivered",
          createdAt: msg.createdAt,
        };
        renderedIdsRef.current.add(msg.id);
        return [...prev, newMsg];
      });

      // Auto-mark as read if we're the receiver
      if (msg.senderId !== currentUserId) {
        void fetch(`/api/messages/${msg.id}/read`, { method: "PATCH" });
      }
    });

    return () => unsub();
  }, [on, conversationId, currentUserId]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const content = input.trim();
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          senderId: currentUserId,
          senderName: currentUserName,
          content,
        }),
      });

      if (res.ok) {
        const saved: Message = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === saved.id)) return prev;
          renderedIdsRef.current.add(saved.id);
          return [...prev, saved];
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">Conversation</p>
          <p className="text-xs text-muted-foreground capitalize">
            {connectionState === "connected" ? "Online" : "Connecting..."}
          </p>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            connectionState === "connected" ? "bg-green-500" : "bg-yellow-500"
          }`}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-3 py-2 ${
                  isOwn
                    ? "bg-charcoal text-cream"
                    : "bg-muted text-foreground"
                }`}
              >
                {!isOwn && (
                  <p className="text-[10px] font-medium text-brass mb-0.5">
                    {msg.senderName}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                <p
                  className={`text-[10px] mt-1 ${
                    isOwn ? "text-cream/60" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 max-h-24"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="p-2 rounded-lg bg-charcoal text-cream hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
