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
    <section id={id} ref={ref} className="bg-charcoal overflow-hidden">
      {/* Desktop: split layout */}
      <div className="hidden md:flex w-full max-w-7xl mx-auto h-[65vh] lg:h-[60vh]">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-1/2 flex flex-col justify-center px-8 lg:px-16"
        >
          <p className="text-brass text-[11px] tracking-[0.3em] uppercase mb-4">
            {t("artOfShoe.subtitle")}
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading text-cream leading-[1.05] mb-6">
            {t("artOfShoe.title")}
          </h2>
          <p className="text-sm md:text-base leading-relaxed mb-8 text-cream/60 max-w-md">
            {t("artOfShoe.body")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 border border-brass text-brass text-[11px] tracking-[0.2em] uppercase hover:bg-brass hover:text-charcoal transition-all duration-300 self-start group"
          >
            {t("artOfShoe.cta")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Right: image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-1/2 h-full relative"
        >
          <Image
            src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784812813/lyzane/craftyman.png"
            alt="Artisan crafting Lyzane shoes"
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="50vw"
          />
        </motion.div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 py-10"
        >
          <p className="text-brass text-[10px] tracking-[0.3em] uppercase mb-3">
            {t("artOfShoe.subtitle")}
          </p>
          <h2 className="text-2xl font-heading text-cream leading-[1.1] mb-4">
            {t("artOfShoe.title")}
          </h2>
          <p className="text-sm leading-relaxed mb-6 text-cream/60">
            {t("artOfShoe.body")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-brass text-brass text-[11px] tracking-[0.2em] uppercase hover:bg-brass hover:text-charcoal transition-all duration-300 group"
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
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
