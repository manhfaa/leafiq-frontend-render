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
        brand: {
          50: "#effef2",
          100: "#d6f7de",
          200: "#aeeec0",
          300: "#7fdc9a",
          400: "#4dc370",
          500: "#2ea857",
          600: "#208645",
          700: "#1d6d3b",
          800: "#1c5732",
          900: "#19482c",
        },
        ink: "#10231b",
        mist: "#f3f8f3",
        glow: "#edf8d8",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(13, 37, 26, 0.10)",
        panel: "0 18px 40px rgba(17, 42, 28, 0.10)",
        float: "0 24px 55px rgba(17, 42, 28, 0.18)",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(135, 224, 167, 0.35), transparent 40%), radial-gradient(circle at top right, rgba(216, 243, 129, 0.24), transparent 35%), linear-gradient(180deg, rgba(245,250,245,0.95) 0%, rgba(235,246,238,0.92) 100%)",
        "dashboard-mesh": "radial-gradient(circle at top left, rgba(46,168,87,0.22), transparent 30%), radial-gradient(circle at 80% 20%, rgba(220,248,161,0.18), transparent 28%), linear-gradient(180deg, rgba(11,25,19,0.98) 0%, rgba(14,35,26,1) 40%, rgba(20,45,33,1) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.85" },
          "70%": { transform: "scale(1.08)", opacity: "0.18" },
          "100%": { transform: "scale(1.12)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
      fontFamily: {
        display: ["var(--font-sora)"],
        sans: ["var(--font-be-vietnam)"],
      },
    },
  },
  plugins: [],
};

export default config;
