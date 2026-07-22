export type Locale = "en" | "ar" | "fr";

export const locales: Locale[] = ["en", "ar", "fr"];

export const defaultLocale: Locale = "en";

export const localeMetadata: Record<Locale, { name: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", dir: "ltr" },
  ar: { name: "العربية", dir: "rtl" },
  fr: { name: "Français", dir: "ltr" },
};
