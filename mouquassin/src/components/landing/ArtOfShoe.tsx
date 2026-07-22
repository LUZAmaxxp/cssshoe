"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
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
    <section
      id={id}
      ref={ref}
      className="relative min-h-[80vh] bg-cream overflow-hidden"
    >
      {/* Text content - left side */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-md z-10"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-charcoal leading-[1.1] mb-6">
              {t("artOfShoe.title")}
            </h2>

            <p className="text-sm md:text-base leading-relaxed mb-8 text-muted-foreground">
              {t("artOfShoe.body")}
            </p>

            <a
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal/70 hover:text-brass transition-colors duration-300 group"
            >
              {t("artOfShoe.cta")}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Person sitting - right side with shadow */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute right-[8%] top-[15%] w-[30%] md:w-[28%] lg:w-[22%] bg-cream"
      >
        {/* Contact shadow on ground */}
        <div
          className="absolute -bottom-8 left-[-10%] right-[-10%] h-[50px] rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, transparent 75%)",
            filter: "blur(18px)",
          }}
        />

        {/* Ambient shadow behind person */}
        <div
          className="absolute top-[5%] -left-[10%] -right-[10%] bottom-[0%] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 70%)",
            filter: "blur(25px)",
            transform: "scaleY(0.95)",
          }}
        />
        
        {/* Person image */}
        <Image
          src="/images/don2.jpg"
          alt="Man wearing Lyzane shoes"
          width={600}
          height={800}
          className="w-full h-auto object-contain mix-blend-multiply relative z-10"
          priority
        />
      </motion.div>
    </section>
  );
}
