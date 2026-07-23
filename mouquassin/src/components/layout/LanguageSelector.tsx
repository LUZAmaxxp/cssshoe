"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/i18n/context";
import { locales, localeMetadata, Locale } from "@/i18n/config";

function hasLocaleCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("locale="));
}

const flagEmoji: Record<Locale, string> = {
  en: "🇬🇧",
  ar: "🇲🇦",
  fr: "🇫🇷",
};

export function LanguageSelector() {
  const { setLocale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!hasLocaleCookie()) {
      setVisible(true);
    }
  }, []);

  const handleSelect = (locale: Locale) => {
    setLocale(locale);
    setFading(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-charcoal flex flex-col items-center justify-center px-6 transition-opacity duration-400 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Brand */}
      <div className="mb-12 text-center animate-[fadeInUp_0.6s_ease_0.2s_both]">
        <h1 className="text-cream text-2xl md:text-3xl font-heading tracking-wide">
          Lyzane
        </h1>
        <p className="text-cream/40 text-[10px] tracking-[0.3em] uppercase mt-2">
          Choose your language
        </p>
      </div>

      {/* Language options */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {locales.map((locale, i) => (
          <button
            key={locale}
            onClick={() => handleSelect(locale)}
            className="group flex items-center gap-4 w-full py-4 px-5 border border-cream/15 hover:border-brass hover:bg-cream/5 transition-all duration-300 animate-[fadeInUp_0.5s_ease_both]"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            <span className="text-2xl">{flagEmoji[locale]}</span>
            <div className="text-left">
              <p className="text-cream text-sm tracking-wider">
                {localeMetadata[locale].name}
              </p>
              <p className="text-cream/30 text-[10px] tracking-[0.15em] uppercase mt-0.5">
                {locale === "en" && "English"}
                {locale === "ar" && "Arabic"}
                {locale === "fr" && "Français"}
              </p>
            </div>
            <span className="ml-auto text-cream/20 group-hover:text-brass transition-colors text-lg">
              ›
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
