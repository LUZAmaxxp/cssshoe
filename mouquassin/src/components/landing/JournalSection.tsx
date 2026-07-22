"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface JournalSectionProps {
  imageSrc: string;
}

export function JournalSection({ imageSrc }: JournalSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] min-h-[70vh]">
      {/* Text panel - dark background */}
      <div className="bg-charcoal flex items-center p-8 md:p-12 lg:p-16 order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md"
        >
          {/* Eyebrow */}
          <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-brass mb-4">
            Journal
          </p>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-cream leading-[1.1] mb-6">
            Stories of craft and character
          </h2>

          {/* CTA */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cream/70 hover:text-brass transition-colors duration-300 group"
          >
            Discover Journal
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Image panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative min-h-[50vh] md:min-h-[70vh] order-1 md:order-2"
      >
        <Image
          src={imageSrc}
          alt="Journal"
          fill
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
