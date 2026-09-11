import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F172A",
          darkNavy: "#0B132B",
          violet: "#7C3AED",
          darkViolet: "#581C87",
          magenta: "#9333EA",
          deepMagenta: "#86198F",
          lavender: "#E9D5FF",
          amber: "#FACC15",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at 50% 30%, rgba(124, 58, 237, 0.25), rgba(15, 23, 42, 0))",
        "card-gradient": "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
