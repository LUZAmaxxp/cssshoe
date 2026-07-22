"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Locale, defaultLocale, localeMetadata } from "./config";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";

const translations: Record<Locale, typeof en> = { en, ar, fr };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = getCookie("locale") as Locale | undefined;
    if (saved && localeMetadata[saved]) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    const dir = localeMetadata[locale].dir;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("locale", newLocale, 365);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[locale], key);
    },
    [locale]
  );

  const dir = localeMetadata[locale].dir;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useLocale must be used within I18nProvider");
  return context;
}
