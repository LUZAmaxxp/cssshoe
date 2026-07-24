"use client";

import { useEffect } from "react";

export function VideoAutoplay() {
  useEffect(() => {
    const playAll = () => {
      document.querySelectorAll("video").forEach((v) => {
        if (v.paused) {
          v.play().catch(() => {});
        }
      });
    };

    playAll();

    // Retry on route changes (Next.js client-side navigation)
    const observer = new MutationObserver(playAll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
