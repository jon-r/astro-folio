import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{astro,ts,tsx}",
  ],
  // todo colour palette to match old site? try to match the green?
  // can font weights be globally overwritten?
  theme: {
    fontWeight: {
      normal: "300",
      bold: "700",
    },

    extend: {
      colors: {
        green: {
          100: "#e4e5e7",
          200: "#b2dfdb",
          300: "#00897B",
          400: "#1c6b63",
          500: "#0e4c46",
          600: "#043333",
          700: "#202121",
        },
        black: "#000",
        grey: "#333",
      },
    },
    container: {
      padding: "2rem",
      center: true,
    },
    fontFamily: {
      sans: ["soleil", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
