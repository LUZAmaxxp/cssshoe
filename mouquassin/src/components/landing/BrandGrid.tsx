"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface BrandGridProps {
  imageSrc: string;
}

const labels = [
  { num: "01", title: "Cuir Italien", desc: "Premium leather", position: "left-[2%] top-[5%]" },
  { num: "02", title: "Finitions", desc: "Hand-stitched details", position: "left-[27%] top-[5%]" },
  { num: "03", title: "Confort", desc: "Natural feel", position: "left-[52%] top-[5%]" },
  { num: "04", title: "Style", desc: "Timeless design", position: "left-[77%] top-[5%]" },
  { num: "05", title: "L'Art du Port", desc: "Worn with confidence", position: "left-[2%] top-[55%]" },
  { num: "06", title: "Présence", desc: "Commanding silhouette", position: "left-[35%] top-[55%]" },
  { num: "07", title: "Caractère", desc: "Defined by detail", position: "left-[70%] top-[55%]" },
];

export function BrandGrid({ imageSrc }: BrandGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-charcoal py-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt="Lyzane Craftsmanship"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          quality={100}
          sizes="100vw"
        />

        {labels.map((label, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className={`absolute ${label.position} hidden md:block`}
          >
            <p className="text-brass text-[9px] tracking-[0.15em] mb-0.5">
              {label.num}
            </p>
            <p className="text-cream text-[10px] tracking-[0.15em] uppercase">
              {label.title}
            </p>
            <p className="text-cream/50 text-[9px] tracking-wide">
              {label.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}