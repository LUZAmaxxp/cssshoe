"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const prev = () => setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
  const next = () => setSelected((s) => (s === images.length - 1 ? 0 : s + 1));

  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen]);

  const lightbox = fullscreen ? createPortal(
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center"
      style={{ zIndex: 99999 }}
    >
      {/* Close button */}
      <button
        onClick={() => setFullscreen(false)}
        className="fixed top-4 right-4 w-12 h-12 bg-black/60 hover:bg-black/80 border border-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        style={{ zIndex: 100000 }}
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 border border-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ zIndex: 100000 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={next}
            className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 border border-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ zIndex: 100000 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm" style={{ zIndex: 100000 }}>
          {selected + 1} / {images.length}
        </div>
      )}

      {/* Thumbnails in lightbox */}
      {images.length > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 100000 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-12 h-12 overflow-hidden border-2 transition-colors cursor-pointer ${
                i === selected ? "border-white" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* Main image */}
      <div className="relative w-full h-full">
        <div className="relative w-full h-full cursor-zoom-in" onClick={() => setFullscreen(true)}>
          {images[selected] ? (
            <Image
              src={images[selected]}
              alt={name}
              fill
              className="object-cover"
              sizes="50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-6xl font-heading">
              M
            </div>
          )}
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => setFullscreen(true)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 text-charcoal" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-charcoal" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-charcoal" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-charcoal/60 backdrop-blur-sm rounded-full text-white text-xs z-10">
            {selected + 1} / {images.length}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative w-12 h-12 overflow-hidden border-2 transition-colors cursor-pointer ${
                  i === selected ? "border-charcoal" : "border-white/50 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox}
    </>
  );
}
