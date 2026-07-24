"use client";

import { I18nProvider } from "@/i18n/context";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { VideoAutoplay } from "@/components/layout/VideoAutoplay";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageSelector />
      <VideoAutoplay />
      {children}
    </I18nProvider>
  );
}
