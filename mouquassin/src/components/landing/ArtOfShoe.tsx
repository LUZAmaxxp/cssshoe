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
    <section
      id={id}
      ref={ref}
      className="relative min-h-[60vh] md:min-h-[80vh] bg-cream overflow-hidden"
    >
      {/* Desktop: absolute layout. Mobile: relative stacked layout */}
      <div className="hidden md:flex absolute inset-0 items-center">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 grid grid-cols-2 gap-8 items-center">
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
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal/70 hover:text-brass transition-colors duration-300 group"
            >
              {t("artOfShoe.cta")}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex justify-center"
          >
            <div className="relative bg-[#f2ede6]">
              <div
                className="absolute -bottom-8 left-[-10%] right-[-10%] h-[50px] rounded-[50%]"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, transparent 75%)",
                  filter: "blur(18px)",
                }}
              />
              <div
                className="absolute top-[5%] -left-[10%] -right-[10%] bottom-[0%] rounded-full"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 70%)",
                  filter: "blur(25px)",
                  transform: "scaleY(0.95)",
                }}
              />
              <Image
                src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804011/lyzane/don2.jpg"
                alt="Man wearing Lyzane shoes"
                width={600}
                height={800}
                className="w-full h-auto object-contain mix-blend-multiply relative z-10 max-w-[400px]"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 py-12"
        >
          <h2 className="text-2xl font-heading text-charcoal leading-[1.1] mb-4">
            {t("artOfShoe.title")}
          </h2>
          <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
            {t("artOfShoe.body")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal/70 hover:text-brass transition-colors duration-300 group"
          >
            {t("artOfShoe.cta")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="px-6 pb-12 flex justify-center bg-[#f2ede6]"
        >
          <Image
            src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804011/lyzane/don2.jpg"
            alt="Man wearing Lyzane shoes"
            width={600}
            height={800}
            className="w-full h-auto object-contain mix-blend-multiply max-w-[300px]"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
