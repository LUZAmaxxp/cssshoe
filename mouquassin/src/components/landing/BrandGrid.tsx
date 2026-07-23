"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const cards = [
  {
    num: "01",
    title: "Cuir Italien",
    desc: "Sélectionné avec soin pour sa qualité exceptionnelle et sa durabilité.",
    image: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784803996/lyzane/grid1.png",
  },
  {
    num: "02",
    title: "Finitions Artisanales",
    desc: "Chaque paire est travaillée avec précision par des mains expérimentées.",
    image: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804001/lyzane/grid2.png",
  },
  {
    num: "03",
    title: "Confort Naturel",
    desc: "Conçu pour épouser la forme du pied et offrir un confort au quotidien.",
    image: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804006/lyzane/grid3.png",
  },
  {
    num: "04",
    title: "Style Intemporel",
    desc: "Des lignes épurées pour un style qui ne se démode jamais.",
    image: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804010/lyzane/grid4.png",
  },
];

export function BrandGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-charcoal">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative aspect-[3/4] overflow-hidden group"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:bg-black/60" />

            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
              <p className="text-brass text-[9px] md:text-[10px] tracking-[0.2em] mb-1 md:mb-2">
                {card.num}
              </p>
              <h3 className="text-cream text-sm md:text-lg font-heading uppercase tracking-wider mb-1 md:mb-2">
                {card.title}
              </h3>
              <p className="text-cream/60 text-[11px] md:text-sm leading-relaxed max-w-xs">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
