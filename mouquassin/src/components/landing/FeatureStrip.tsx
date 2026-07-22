"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface FeatureItem {
  numeral: string;
  label: string;
  description: string;
  imageSrc: string;
}

const features: FeatureItem[] = [
  {
    numeral: "01",
    label: "Cuir Italien",
    description: "Premium Italian leather",
    imageSrc: "/images/shoeimg1v!.png",
  },
  {
    numeral: "02",
    label: "Finitions Artisanales",
    description: "Hand-finished details",
    imageSrc: "/images/occasion-v1.png",
  },
  {
    numeral: "03",
    label: "Confort Naturel",
    description: "All-day comfort",
    imageSrc: "/images/shoeimg1v!.png",
  },
  {
    numeral: "04",
    label: "Style Intemporel",
    description: "Timeless design",
    imageSrc: "/images/occasion-v1.png",
  },
];

export function FeatureStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-charcoal py-16">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.numeral}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative aspect-[3/4] overflow-hidden group"
          >
            <Image
              src={feature.imageSrc}
              alt={feature.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(13,12,10,0.8) 0%, rgba(13,12,10,0.2) 50%, transparent 100%)",
              }}
            />

            {/* Numeral */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <span className="text-cream/40 text-[10px] tracking-[0.2em]">
                {feature.numeral}
              </span>
            </div>

            {/* Label and description */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
              <p className="text-cream text-[10px] md:text-[11px] tracking-[0.15em] uppercase mb-1">
                {feature.label}
              </p>
              <p className="text-cream/55 text-[10px] md:text-[11px]">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
