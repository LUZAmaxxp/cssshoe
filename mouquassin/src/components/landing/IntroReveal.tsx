"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroRevealProps {
  children: React.ReactNode;
}

export function IntroReveal({ children }: IntroRevealProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[100] bg-charcoal"
          >
            {/* Mobile: logo centered on dark background */}
            <div className="md:hidden w-full h-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col items-center"
              >
                <Image
                  src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png"
                  alt="Lyzane"
                  width={80}
                  height={80}
                  className="w-16 h-16 mb-4"
                  priority
                />
                <Image
                  src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804014/lyzane/title-nobg.png"
                  alt="Lyzane"
                  width={400}
                  height={80}
                  className="w-48 h-auto"
                  priority
                />
              </motion.div>
            </div>

            {/* Desktop: image background */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="hidden md:block relative w-full h-full"
            >
              <Image
                src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784803992/lyzane/first.png"
                alt="Lyzane"
                fill
                className="object-cover"
                priority
                quality={100}
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, rgba(13,12,10,0.3) 0%, rgba(13,12,10,0.5) 100%)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
