"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface SplitFeatureProps {
  id?: string;
  subtitle?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageSide?: "left" | "right";
  variant?: "light" | "dark";
  flushEdge?: boolean;
  numeral?: string;
}

export function SplitFeature({
  id,
  subtitle,
  title,
  body,
  ctaLabel = "Our Philosophy +",
  ctaHref = "/shop",
  imageSrc,
  imageSide = "left",
  variant = "light",
  flushEdge = false,
  numeral,
}: SplitFeatureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isDark = variant === "dark";
  const imageOnLeft = imageSide === "left";
  const hasImage = !!imageSrc;

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-[80vh] flex flex-col ${hasImage ? "md:flex-row" : ""} ${isDark ? "bg-charcoal" : "bg-cream"}`}
    >
      {/* Ghost numeral watermark */}
      {numeral && (
        <span
          className={`absolute top-4 font-heading text-[90px] md:text-[120px] leading-none pointer-events-none select-none z-0 ${
            isDark ? "" : ""
          } ${imageOnLeft ? "right-8 lg:right-16" : "left-8 lg:left-16"}`}
          style={{ color: isDark ? "rgba(242,237,230,0.05)" : "rgba(13,12,10,0.04)" }}
        >
          {numeral}
        </span>
      )}
      {/* Image column */}
      {hasImage && (
        <motion.div
          initial={{ opacity: 0, x: imageOnLeft ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative flex items-center justify-center p-8 ${
            isDark ? "bg-charcoal" : "bg-cream"
          } ${imageOnLeft ? "order-1" : "order-2"} ${
            flushEdge && !imageOnLeft ? "md:w-[35%] lg:w-[40%]" : "md:w-1/2"
          }`}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={700}
            height={600}
            className="w-[80%] max-w-[420px] h-auto object-contain mix-blend-multiply"
          />
        </motion.div>
      )}

      {/* Text column */}
      <div className={`flex items-center p-6 md:p-12 lg:p-16 ${
        hasImage ? (imageOnLeft ? "order-2" : "order-1") : ""
      } ${hasImage ? (flushEdge && !imageOnLeft ? "md:w-[65%] lg:w-[60%]" : "md:w-1/2") : "w-full"}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md"
        >
          {subtitle && (
            <p className={`text-[11px] tracking-[0.3em] uppercase mb-4 ${
              isDark ? "text-brass" : "text-brass"
            }`}>
              {subtitle}
            </p>
          )}

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading leading-[1.1] mb-6 ${
              isDark ? "text-cream" : "text-charcoal"
            }`}
          >
            {title}
          </h2>

          <p
            className={`text-sm md:text-base leading-relaxed mb-8 ${
              isDark ? "" : "text-muted-foreground"
            }`}
            style={isDark ? { color: "rgba(242,237,230,0.55)" } : undefined}
          >
            {body}
          </p>

          <a
            href={ctaHref}
            className={`inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 group ${
              isDark
                ? "text-cream/70 hover:text-brass"
                : "text-charcoal/70 hover:text-brass"
            }`}
          >
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}