import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Cairo", "Tajawal", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        cyber: ["var(--font-cyber)", "sans-serif"],
      },
      boxShadow: {
        "3d-cell": "0 10px 0 0 rgba(0,0,0,0.35), 0 15px 25px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.25)",
        "3d-cell-pressed": "0 2px 0 0 rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.4), inset 0 3px 5px rgba(0,0,0,0.3)",
        "3d-board": "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(120, 119, 198, 0.15), inset 0 1px 1px rgba(255,255,255,0.15)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)",
        "glow-rose": "0 0 20px rgba(244, 63, 94, 0.6), 0 0 40px rgba(244, 63, 94, 0.3)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.3)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.3)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
