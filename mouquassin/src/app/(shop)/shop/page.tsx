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
      <main className="container mx-auto px-4 py-6 pt-20 md:py-8 md:pt-24">
        <h1 className="text-2xl md:text-3xl font-heading text-charcoal mb-1 md:mb-2">{t("shop.collectionTitle")}</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-5 md:mb-8">
          {t("shop.subtitle")}
        </p>
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
