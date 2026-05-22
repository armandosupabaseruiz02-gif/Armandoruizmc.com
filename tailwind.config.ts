import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        naranja: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        warm: {
          50:  "#fffaf5",
          100: "#fff4ea",
          200: "#ffe8d0",
        },
      },
      fontFamily: {
        sans: ["var(--font-atkinson)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        btn:  "16px",
        pill: "9999px",
      },
      boxShadow: {
        card:       "0 4px 20px rgba(0,0,0,0.06)",
        "card-hover": "0 16px 48px rgba(234,96,0,0.15)",
        "btn-glow":  "0 4px 20px rgba(249,115,22,0.40)",
      },
      animation: {
        "float":       "float 6s ease-in-out infinite",
        "pulse-ring":  "pulseRing 2.5s ease-out infinite",
        "slide-up":    "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-16px)" },
        },
        pulseRing: {
          "0%":   { transform: "scale(1)",   opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
