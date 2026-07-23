"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/context";

export function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[100dvh] overflow-hidden bg-charcoal">
      {/* Background image */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784803988/lyzane/branding7.png"
          alt="Lyzane"
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
      </motion.div>

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(13,12,10,0.75) 0%, rgba(13,12,10,0.2) 50%, transparent 80%)",
        }}
      />

      {/* Text block - centered */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 md:px-8"
      >
        <div className="text-center">
          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center"
          >
            <Image
              src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804014/lyzane/title-nobg.png"
              alt="Lyzane"
              width={1250}
              height={250}
              className="h-10 md:h-20 lg:h-[120px] w-auto"
              priority
            />
          </motion.div>

          {/* CTA link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-6"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cream/70 hover:text-brass transition-colors duration-300 group"
            >
              {t("hero.exploreCollection")}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Pagination indicator - bottom left */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-16 z-10">
        <p
          className="text-[10px] tracking-[0.25em] uppercase"
          style={{ color: "rgba(242,237,230,0.4)" }}
        >
          01 — 03
        </p>
      </div>

      {/* Scroll hint - bottom right (hidden on mobile) */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-16 z-10 hidden md:flex flex-col items-center gap-2">
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{
            color: "rgba(242,237,230,0.4)",
            writingMode: "vertical-rl",
          }}
        >
          {t("hero.scroll")}
        </p>
        <div className="w-px h-8 bg-cream/20" />
      </div>
    </section>
  );
}
