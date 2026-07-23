"use client";

import { I18nProvider } from "@/i18n/context";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <LanguageSelector />
      {children}
    </I18nProvider>
  );
}
