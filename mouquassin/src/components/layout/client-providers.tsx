"use client";

import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/i18n/context";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { VideoAutoplay } from "@/components/layout/VideoAutoplay";
import { CustomerChat } from "@/components/chat/CustomerChat";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <LanguageSelector />
        <VideoAutoplay />
        {children}
        <CustomerChat />
      </I18nProvider>
    </SessionProvider>
  );
}
