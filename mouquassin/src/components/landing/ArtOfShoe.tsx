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
          <Image
            src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784812813/lyzane/craftyman.png"
            alt="Artisan crafting Lyzane shoes"
            fill
            className="object-cover object-left"
            priority
            quality={90}
            sizes="50vw"
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
      <div className="md:hidden flex flex-col relative">
        {/* Ghost numeral watermark — mobile */}
        <span
          className="absolute top-2 left-4 font-heading text-[60px] leading-none pointer-events-none select-none z-0"
          style={{ color: "rgba(13,12,10,0.04)" }}
        >
          01
        </span>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 py-10 relative z-10"
        >
          <p className="text-brass text-[10px] tracking-[0.3em] uppercase mb-3">
            {t("artOfShoe.subtitle")}
          </p>
          <h2 className="text-2xl font-heading text-charcoal leading-[1.1] mb-4">
            {t("artOfShoe.title")}
          </h2>
          <p className="text-sm leading-relaxed mb-6 text-charcoal/60">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative w-full aspect-[16/9]"
        >
          <Image
            src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784812813/lyzane/craftyman.png"
            alt="Artisan crafting Lyzane shoes"
            fill
            className="object-cover object-left"
            priority
            quality={85}
            sizes="100vw"
          />
          {/* Gradient bridge — mobile top edge */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: "linear-gradient(to bottom, #f2ede6 0%, rgba(242,237,230,0) 6%)",
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
