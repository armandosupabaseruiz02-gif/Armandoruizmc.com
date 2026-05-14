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
        ink: {
          950: "#0b0907",  // tintado hacia naranja, no negro puro
          900: "#130f0b",
          800: "#1d1710",
          700: "#2a2119",
          600: "#433628",
        },
      },
      fontFamily: {
        sans: ["var(--font-atkinson)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "orange-glow": "radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":      { opacity: "0.8", transform: "scale(1.05)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
      },
      boxShadow: {
        "card":        "0 4px 24px 0 rgba(0,0,0,0.06)",
        "card-hover":  "0 20px 60px 0 rgba(249,115,22,0.15)",
        "glow-sm":     "0 0 20px rgba(249,115,22,0.3)",
        "glow":        "0 0 40px rgba(249,115,22,0.4)",
        "glow-lg":     "0 0 80px rgba(249,115,22,0.3)",
        "inner-glow":  "inset 0 0 40px rgba(249,115,22,0.1)",
        "dark-card":   "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)",
      },
      borderRadius: {
        "card": "20px",
        "btn":  "14px",
        "pill": "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
