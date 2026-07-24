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
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[100dvh] overflow-hidden bg-charcoal">
      {/* Background video */}
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          className="w-full h-full object-cover object-[center_70%]"
        >
          <source src="https://res.cloudinary.com/dzrsbjdma/video/upload/v1784844238/lyzane/hero-video.mp4" type="video/mp4" />
        </video>
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
              className="inline-flex items-center gap-2 px-6 py-3 border border-brass text-brass text-[11px] tracking-[0.2em] uppercase hover:bg-brass hover:text-charcoal transition-all duration-300 group"
            >
              {t("hero.exploreCollection")}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
