"use client";

import { useLocale } from "@/i18n/context";
import { SplitFeature } from "@/components/landing/SplitFeature";
import { BrandGrid } from "@/components/landing/BrandGrid";

export function LandingSections() {
  const { t } = useLocale();

  return (
    <>
      <BrandGrid />

      <SplitFeature
        title={t("splitFeature.title")}
        body={t("splitFeature.body")}
        ctaLabel={t("splitFeature.cta")}
        ctaHref="/shop"
        imageSrc="/images/logo.jpg"
        imageSide="right"
        variant="light"
      />
    </>
  );
}
