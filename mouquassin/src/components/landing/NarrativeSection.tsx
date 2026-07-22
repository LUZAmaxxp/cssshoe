"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface NarrativeSectionProps {
  id: string;
  title: string;
  paragraphs: string[];
  align?: "left" | "right" | "center";
  index: number;
  chapterLabel: string;
  variant?: "light" | "dark";
  nextVariant?: "light" | "dark" | "cta";
  image?: string;
}

const gradientColors = {
  light: "#f5f5f5",
  dark: "#1a1a1a",
  cta: "#0f0d0c",
};

export function NarrativeSection({
  id,
  title,
  paragraphs,
  align = "center",
  index,
  chapterLabel,
  variant = "light",
  nextVariant,
  image,
}: NarrativeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isDark = variant === "dark";
  const hasImage = !!image;

  const textAlignClasses = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-[80vh] flex items-center py-24 px-4 overflow-hidden ${
        isDark ? "bg-charcoal" : "bg-cream"
      }`}
    >
      {/* Gradient transition to next section */}
      {nextVariant && (
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to bottom, transparent, ${gradientColors[nextVariant]})`,
          }}
        />
      )}

      {/* Brass radial glow on dark sections */}
      {isDark && (
        <div
          className="absolute w-[260px] h-[260px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(181,152,90,0.18) 0%, transparent 70%)",
            top: "50%",
            [align === "right" ? "right" : "left"]: "-40px",
            transform: "translateY(-50%)",
          }}
        />
      )}

      {/* Ghost numeral watermark */}
      <p
        className="absolute top-[-10px] right-5 pointer-events-none select-none"
        style={{
          fontSize: "120px",
          lineHeight: 1,
          fontWeight: 700,
          fontFamily: "var(--font-playfair), serif",
          color: isDark ? "rgba(245,245,245,0.05)" : "rgba(26,26,26,0.04)",
        }}
      >
        {String(index).padStart(2, "0")}
      </p>

      <div className={`w-full max-w-6xl mx-auto ${hasImage ? "grid grid-cols-1 md:grid-cols-2 gap-12 items-center" : ""}`}>
        {/* Image column (left side) */}
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Text column */}
        <div className={hasImage ? "" : align === "right" ? "max-w-2xl ml-auto" : align === "center" ? "max-w-3xl mx-auto" : "max-w-2xl"}>
          <div className={textAlignClasses[align]}>
            {/* Eyebrow label + hairline */}
            <motion.div
              initial={{ opacity: 0, x: align === "right" ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className={`flex items-center gap-2.5 mb-3.5 ${
                align === "right"
                  ? "justify-end"
                  : align === "center"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              <span
                className="w-6 h-px"
                style={{
                  backgroundColor: isDark ? "#b5985a" : "#722f37",
                  order: align === "right" ? 2 : 0,
                }}
              />
              <span
                className="text-[11px] tracking-[0.25em] uppercase"
                style={{ color: isDark ? "#b5985a" : "#722f37" }}
              >
                {chapterLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className={`text-4xl md:text-5xl lg:text-6xl font-heading mb-8 ${
                isDark ? "text-cream" : "text-charcoal"
              }`}
            >
              {title}
            </motion.h2>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-0.5 mb-4"
              style={{
                background: align === "right"
                  ? "linear-gradient(270deg, #722f37, transparent)"
                  : "linear-gradient(90deg, #b5985a, transparent)",
                marginLeft: align === "right" ? "auto" : align === "center" ? "auto" : 0,
                marginRight: align === "center" ? "auto" : 0,
              }}
            />

            {/* Paragraphs */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className={`text-lg md:text-xl leading-relaxed ${
                    isDark ? "" : "text-muted-foreground"
                  }`}
                  style={isDark ? { color: "rgba(245,245,245,0.55)" } : undefined}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}