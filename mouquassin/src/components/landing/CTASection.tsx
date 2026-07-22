"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] flex items-center justify-center py-24 px-4 overflow-hidden bg-charcoal"
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "260px",
          height: "260px",
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(181,152,90,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="text-center max-w-2xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading text-cream mb-6"
        >
          Ready to Step Into Elegance?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg mb-10"
          style={{ color: "rgba(245,245,245,0.55)" }}
        >
          Each pair is handcrafted to order. Explore our collection and find your
          perfect fit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link
            href="/shop"
            className="inline-block bg-transparent border border-brass text-brass px-8 py-3 text-sm tracking-widest uppercase hover:bg-brass hover:text-charcoal transition-colors duration-300"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}