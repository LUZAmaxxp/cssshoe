"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/context";

interface ArtOfShoeProps {
  id?: string;
}

export function ArtOfShoe({ id }: ArtOfShoeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLocale();

  return (
    <section id={id} ref={ref} className="bg-cream overflow-hidden">
      {/* Desktop: split layout — image bleeds to right edge */}
      <div className="hidden md:block relative w-full h-[65vh] lg:h-[60vh]">
        {/* Ghost numeral watermark */}
        <span
          className="absolute top-2 left-8 lg:left-16 font-heading text-[90px] leading-none pointer-events-none select-none z-0"
          style={{ color: "rgba(13,12,10,0.04)" }}
        >
          01
        </span>

        {/* Text — left side, padded */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center pl-8 lg:pl-16 pr-8 z-10"
        >
          <p className="text-brass text-[11px] tracking-[0.3em] uppercase mb-4">
            {t("artOfShoe.subtitle")}
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading text-charcoal leading-[1.05] mb-6">
            {t("artOfShoe.title")}
          </h2>
          <p className="text-sm md:text-base leading-relaxed mb-8 text-charcoal/60 max-w-md">
            {t("artOfShoe.body")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal text-charcoal text-[11px] tracking-[0.2em] uppercase hover:bg-charcoal hover:text-cream transition-all duration-300 self-start group"
          >
            {t("artOfShoe.cta")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Image — right half, bleeds to edge */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-0 right-0 w-1/2 h-full"
        >
          {/* Ambient shadow behind person */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 55% 45% at 65% 50%, rgba(13,12,10,0.15) 0%, transparent 65%)",
            }}
          />
          <Image
            src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784913479/lyzane/shoeart-no-bg.png"
            alt="Artisan wearing Lyzane classic shoe"
            fill
            className="object-contain object-right relative z-[1]"
            priority
            quality={90}
            sizes="50vw"
          />
          {/* Floor shadow — elliptical gradient at bottom */}
          <div
            className="absolute bottom-0 right-0 w-[90%] h-[35%] z-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 65% 90% at 50% 100%, rgba(13,12,10,0.25) 0%, rgba(13,12,10,0.08) 40%, transparent 70%)",
            }}
          />
          {/* Gradient bridge — blends image into cream text panel */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: "linear-gradient(90deg, #f2ede6 0%, rgba(242,237,230,0) 8%)",
            }}
          />
          {/* Corner frame marks */}
          <div
            className="absolute top-3.5 left-3.5 w-[18px] h-[18px] pointer-events-none z-10"
            style={{
              borderTop: "1px solid rgba(201,168,118,0.5)",
              borderLeft: "1px solid rgba(201,168,118,0.5)",
            }}
          />
          <div
            className="absolute bottom-3.5 right-3.5 w-[18px] h-[18px] pointer-events-none z-10"
            style={{
              borderBottom: "1px solid rgba(201,168,118,0.5)",
              borderRight: "1px solid rgba(201,168,118,0.5)",
            }}
          />
          {/* Editorial caption */}
          <span
            className="absolute bottom-3 right-4 text-[10px] tracking-wide italic pointer-events-none z-10"
            style={{ color: "rgba(13,12,10,0.4)" }}
          >
            Atelier — Fez, Morocco
          </span>
        </motion.div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden relative">
        {/* Ghost numeral watermark — mobile */}
        <span
          className="absolute top-2 left-4 font-heading text-[60px] leading-none pointer-events-none select-none z-0"
          style={{ color: "rgba(13,12,10,0.04)" }}
        >
          01
        </span>

        {/* Text — compact, top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-5 pt-10 pb-4 relative z-10"
        >
          <p className="text-brass text-[10px] tracking-[0.3em] uppercase mb-2">
            {t("artOfShoe.subtitle")}
          </p>
          <h2 className="text-[26px] font-heading text-charcoal leading-[1.1] mb-3">
            {t("artOfShoe.title")}
          </h2>
          <p className="text-[13px] leading-relaxed mb-5 text-charcoal/60">
            {t("artOfShoe.body")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal text-charcoal text-[11px] tracking-[0.2em] uppercase hover:bg-charcoal hover:text-cream transition-all duration-300 group"
          >
            {t("artOfShoe.cta")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Image — full bleed, tall */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative w-full h-[55vh]"
        >
          {/* Ambient shadow behind person — mobile */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(13,12,10,0.15) 0%, transparent 65%)",
            }}
          />
          <Image
            src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784913479/lyzane/shoeart-no-bg.png"
            alt="Artisan wearing Lyzane classic shoe"
            fill
            className="object-contain object-bottom relative z-[1]"
            priority
            quality={85}
            sizes="100vw"
          />
          {/* Floor shadow — mobile */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[30%] z-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 75% 90% at 50% 100%, rgba(13,12,10,0.25) 0%, rgba(13,12,10,0.08) 40%, transparent 70%)",
            }}
          />
          {/* Gradient bridge — mobile top edge blends into text */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: "linear-gradient(to bottom, #f2ede6 0%, rgba(242,237,230,0) 8%)",
            }}
          />
          {/* Corner frame marks — mobile */}
          <div
            className="absolute top-3 left-3 w-[14px] h-[14px] pointer-events-none z-10"
            style={{
              borderTop: "1px solid rgba(201,168,118,0.5)",
              borderLeft: "1px solid rgba(201,168,118,0.5)",
            }}
          />
          <div
            className="absolute bottom-3 right-3 w-[14px] h-[14px] pointer-events-none z-10"
            style={{
              borderBottom: "1px solid rgba(201,168,118,0.5)",
              borderRight: "1px solid rgba(201,168,118,0.5)",
            }}
          />
          {/* Editorial caption — mobile */}
          <span
            className="absolute bottom-2 right-3 text-[9px] tracking-wide italic pointer-events-none z-10"
            style={{ color: "rgba(13,12,10,0.4)" }}
          >
            Atelier — Fez, Morocco
          </span>
        </motion.div>
      </div>
    </section>
  );
}
