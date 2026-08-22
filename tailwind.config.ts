import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#070A12",
          deep: "#04060C",
          soft: "#0C111C",
        },
        surface: {
          DEFAULT: "#111827",
          raised: "#1A2234",
          elevated: "#222C42",
          border: "rgba(232, 236, 244, 0.07)",
          "border-strong": "rgba(201, 162, 39, 0.25)",
        },
        ink: {
          DEFAULT: "#F1F4F9",
          dim: "#94A0B8",
          faint: "#5E6A82",
          muted: "#3E485C",
        },
        line: {
          DEFAULT: "#C9A227",
          soft: "#E0BE4C",
          bright: "#F0D06A",
          dim: "rgba(201, 162, 39, 0.35)",
          glow: "rgba(201, 162, 39, 0.15)",
        },
        brass: {
          DEFAULT: "#C9A227",
          soft: "#E0BE4C",
          bright: "#F0D06A",
        },
        status: {
          live: "#34D399",
          progress: "#F59E0B",
          planned: "#64748B",
          danger: "#F87171",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "meridian-grid":
          "linear-gradient(rgba(232,236,244,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,236,244,0.03) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201, 162, 39, 0.15), transparent)",
        "card-glow":
          "radial-gradient(circle at top, rgba(201, 162, 39, 0.08), transparent 70%)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      maxWidth: {
        content: "1200px",
        narrow: "720px",
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(201, 162, 39, 0.15)",
        "glow-md": "0 0 40px rgba(201, 162, 39, 0.2)",
        "glow-lg": "0 0 80px rgba(201, 162, 39, 0.25)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 162, 39, 0.1)",
      },
      keyframes: {
        drift: {
          "0%": { backgroundPosition: "0px 0px" },
          "100%": { backgroundPosition: "56px 112px" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(80px) rotate(-360deg)" },
        },
      },
      animation: {
        drift: "drift 80s linear infinite",
        fadeUp: "fadeUp 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        orbit: "orbit 20s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
                   
