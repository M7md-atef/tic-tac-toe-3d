"use client";

import confetti from "canvas-confetti";

/**
 * Triggers a vibrant multi-directional confetti blast
 */
export function triggerCelebrationConfetti(primaryColor?: string) {
  if (typeof window === "undefined") return;

  const count = 180;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: primaryColor
        ? [primaryColor, "#f59e0b", "#a855f7", "#ec4899", "#3b82f6"]
        : ["#06b6d4", "#f43f5e", "#f59e0b", "#10b981", "#a855f7"],
    });
  }

  // Multi-tier fireworks explosion effect
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
