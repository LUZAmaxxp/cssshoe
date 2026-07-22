"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopContent } from "./ShopContent";
import { useLocale } from "@/i18n/context";

export default function ShopPage() {
  const { t } = useLocale();

  return (
    <>
      <Navbar alwaysSolid />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-heading text-charcoal mb-2">{t("shop.title")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("shop.subtitle")}
        </p>
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
