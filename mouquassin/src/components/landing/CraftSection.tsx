"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/context";

interface CraftSectionProps {
  id?: string;
}

export function CraftSection({ id }: CraftSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLocale();

  return (
    <section
      id={id}
      ref={ref}
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/images/craft.webm" type="video/webm" />
      </video>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-charcoal/60" />

      {/* Text content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-cream leading-[1.1] mb-6">
            {t("craft.title")}
          </h2>

          <p
            className="text-sm md:text-base leading-relaxed mb-8"
            style={{ color: "rgba(242,237,230,0.55)" }}
          >
            {t("craft.body")}
          </p>

          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cream/70 hover:text-brass transition-colors duration-300 group"
          >
            {t("craft.cta")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
