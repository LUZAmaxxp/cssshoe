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
        imageSrc="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804012/lyzane/logo.jpg"
        imageSide="right"
        variant="light"
      />
    </>
  );
}
