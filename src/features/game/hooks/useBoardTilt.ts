"use client";

import { useEffect, useRef, useState } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
}

const DEFAULT_TILT: TiltState = { rotateX: 0, rotateY: 0 };

export function useBoardTilt(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>(DEFAULT_TILT);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setTilt(DEFAULT_TILT);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized -1 to 1
      const nx = (e.clientX - centerX) / (rect.width / 2);
      const ny = (e.clientY - centerY) / (rect.height / 2);

      // Gentle ±8° range — keeps clicks aligned, feels tactile
      const rotateY = Math.max(-8, Math.min(8, nx * 8));
      const rotateX = Math.max(-8, Math.min(8, -ny * 8));

      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        setTilt({ rotateX, rotateY });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        setTilt(DEFAULT_TILT);
      });
    };

    // Listen on window so we still get events even on fast cursor moves
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      node.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled]);

  return { containerRef, tilt };
}
