"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Minus } from "lucide-react";
import { useSocket, type MessageEvent } from "@/hooks/useSocket";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  status: "delivered" | "read";
  createdAt: string;
}

interface ConversationInfo {
  conversationId: string;
  customerName: string;
  latestMessage: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

function generateCustomerId(): string {
  if (typeof window !== "undefined") {
    let id = localStorage.getItem("chat_customer_id");
    if (!id) {
      id = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem("chat_customer_id", id);
    }
    return id;
  }
  return `cust_${Date.now()}`;
}

function getSavedName(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chat_customer_name") || "";
  }
  return "";
}

function saveName(name: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("chat_customer_name", name);
  }
}

function getConversationId(customerId: string): string {
  return `conv_${customerId}`;
}

export function CustomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [customerId] = useState(() => generateCustomerId());
  const [customerName, setCustomerName] = useState(() => getSavedName());
  const [nameSet, setNameSet] = useState(() => getSavedName() !== "");
  const [existingConversations, setExistingConversations] = useState<ConversationInfo[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const conversationId = getConversationId(customerId);
  const { on, connectionState } = useSocket(isOpen ? conversationId : null);

  // Load existing conversations when chat opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    async function loadConversations() {
      try {
        const res = await fetch(`/api/conversations?customerId=${customerId}`);
        if (res.ok && !cancelled) {
          const data: ConversationInfo[] = await res.json();
          setExistingConversations(data);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    }
    loadConversations();
    return () => { cancelled = true; };
  }, [isOpen, customerId]);

  // Load messages when name is set and chat is open
  useEffect(() => {
    if (!isOpen || !nameSet) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversationId}`
        );
        if (res.ok && !cancelled) {
          const data: Message[] = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isOpen, nameSet, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const unsub = on("message_received", (data) => {
      const msg = data as unknown as MessageEvent;
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [
          ...prev,
          {
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderName,
            content: msg.content,
            status: "delivered",
            createdAt: msg.createdAt,
          },
        ];
      });

      if (msg.senderId !== customerId) {
        void fetch(`/api/messages/${msg.id}/read`, { method: "PATCH" });
      }
    });

    return () => unsub();
  }, [on, conversationId, customerId]);

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
          senderId: customerId,
          senderName: customerName,
          content,
        }),
      });

      if (res.ok) {
        const saved: Message = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === saved.id)) return prev;
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

  const handleSetName = () => {
    if (customerName.trim()) {
      saveName(customerName.trim());
      setNameSet(true);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Floating chat + WhatsApp buttons
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20ba5a] transition-colors flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-charcoal text-cream rounded-full shadow-lg hover:bg-charcoal/90 transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    );
  }

  // Name input screen (only show if no saved name)
  if (!nameSet) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-charcoal text-cream">
          <h3 className="text-sm font-medium">Chat with us</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-cream/10 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {existingConversations.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 mb-2">
              <p className="text-xs text-muted-foreground mb-1">
                Welcome back! You have {existingConversations.length} previous conversation{existingConversations.length > 1 ? "s" : ""}.
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Enter your name to start chatting with our team.
          </p>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSetName()}
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            autoFocus
          />
          <button
            onClick={handleSetName}
            disabled={!customerName.trim()}
            className="w-full py-2 bg-charcoal text-cream rounded-lg text-sm font-medium hover:bg-charcoal/90 disabled:opacity-50 transition-colors"
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-[450px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-charcoal text-cream">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Chat with us</h3>
          <div
            className={`w-2 h-2 rounded-full ${
              connectionState === "connected" ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-cream/10 rounded-md transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-cream/10 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground text-xs py-8">
                Send a message and we&apos;ll get back to you!
              </p>
            )}
            {messages.map((msg) => {
              const isOwn = msg.senderId === customerId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 ${
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
          <div className="px-3 py-2 border-t border-border">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 max-h-20"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="p-2 rounded-lg bg-charcoal text-cream hover:bg-charcoal/90 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
