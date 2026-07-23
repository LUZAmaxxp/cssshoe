"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/i18n/context";
import { locales, localeMetadata, Locale } from "@/i18n/config";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const flagEmoji: Record<Locale, string> = {
  en: "🇬🇧",
  ar: "🇲🇦",
  fr: "🇫🇷",
};

export function LanguageSelector() {
  const { setLocale } = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = getCookie("locale");
    if (!saved) {
      setShow(true);
    }
  }, []);

  const handleSelect = (locale: Locale) => {
    setLocale(locale);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="lang-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] bg-charcoal flex flex-col items-center justify-center px-6"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-cream text-2xl md:text-3xl font-heading tracking-wide">
              Lyzane
            </h1>
            <p className="text-cream/40 text-[10px] tracking-[0.3em] uppercase mt-2">
              Choose your language
            </p>
          </motion.div>

          {/* Language options */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {locales.map((locale, i) => (
              <motion.button
                key={locale}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                onClick={() => handleSelect(locale)}
                className="group flex items-center gap-4 w-full py-4 px-5 border border-cream/15 hover:border-brass hover:bg-cream/5 transition-all duration-300"
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
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
