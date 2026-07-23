"use client";

import { useState, useEffect } from "react";
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

  // Lock body scroll in fullscreen
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [fullscreen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    if (fullscreen) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [fullscreen]);

  return (
    <>
      <div className="relative w-full h-full flex flex-col">
        {/* Main image */}
        <div className="relative flex-1 w-full min-h-[50vh] md:min-h-0 cursor-zoom-in" onClick={() => setFullscreen(true)}>
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

          {/* Fullscreen button */}
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
          >
            <Maximize2 className="w-4 h-4 text-charcoal" />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
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
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative w-14 h-14 overflow-hidden border-2 transition-colors ${
                  i === selected ? "border-charcoal" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen lightbox */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={() => setFullscreen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            style={{ zIndex: 10001 }}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-16" onClick={(e) => e.stopPropagation()}>
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
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                style={{ zIndex: 10001 }}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                style={{ zIndex: 10001 }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm" style={{ zIndex: 10001 }}>
              {selected + 1} / {images.length}
            </div>
          )}

          {/* Thumbnails in lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 10001 }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                  className={`relative w-12 h-12 overflow-hidden border-2 transition-colors ${
                    i === selected ? "border-white" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
