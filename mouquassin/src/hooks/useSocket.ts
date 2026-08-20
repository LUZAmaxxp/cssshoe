"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as Ably from "ably";

interface MessageEvent {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface ReadEvent {
  messageId: string;
  conversationId: string;
  readAt: string;
}

type EventCallback = (data: Record<string, unknown>) => void;

export function useSocket(conversationId: string | null) {
  const ablyRef = useRef<Ably.Realtime | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  const [connectionState, setConnectionState] = useState<string>("disconnected");
  const listenersRef = useRef<Map<string, Set<EventCallback>>>(new Map());

  useEffect(() => {
    if (!conversationId) return;

    const ably = new Ably.Realtime({
      authUrl: `/api/auth/ably-token?conversationId=${conversationId}`,
      authMethod: "GET",
      clientId: `client:${conversationId}`,
    });

    ablyRef.current = ably;

    ably.connection.on("connected", () => setConnectionState("connected"));
    ably.connection.on("disconnected", () => setConnectionState("disconnected"));
    ably.connection.on("failed", () => setConnectionState("failed"));

    const channel = ably.channels.get(`conversation:${conversationId}`);
    channelRef.current = channel;

    // Re-register existing listeners on new channel
    listenersRef.current.forEach((callbacks, eventName) => {
      callbacks.forEach((cb) => {
        channel.subscribe(eventName, (msg) => cb(msg.data as Record<string, unknown>));
      });
    });

    return () => {
      // Only detach if channel is attached or attaching
      if (channel.state === "attached" || channel.state === "attaching") {
        channel.detach().catch(() => {});
      }
      ably.close();
      ablyRef.current = null;
      channelRef.current = null;
      setConnectionState("disconnected");
    };
  }, [conversationId]);

  const on = useCallback(
    (eventName: string, callback: EventCallback) => {
      if (!channelRef.current) return () => {};

      const channel = channelRef.current;

      // Track listener for re-registration
      if (!listenersRef.current.has(eventName)) {
        listenersRef.current.set(eventName, new Set());
      }
      listenersRef.current.get(eventName)!.add(callback);

      channel.subscribe(eventName, (msg) => {
        callback(msg.data as Record<string, unknown>);
      });

      return () => {
        channel.unsubscribe(eventName, (msg) => {
          callback(msg.data as Record<string, unknown>);
        });
        listenersRef.current.get(eventName)?.delete(callback);
      };
    },
    [],
  );

  const emit = useCallback(
    (eventName: string, data: Record<string, unknown>) => {
      if (!channelRef.current) return;
      channelRef.current.publish(eventName, data);
    },
    []
  );

  return { on, emit, connectionState };
}

export type { MessageEvent, ReadEvent };
