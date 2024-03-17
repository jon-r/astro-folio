import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./src/**/*.{astro,ts,tsx}",
  ],

  theme: {
    fontWeight: {
      normal: "400",
      bold: "700",
    },
    fontFamily: {
      display: ["'Josefin Sans Variable'", ...defaultTheme.fontFamily.sans],
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
  },
  plugins: [],
} satisfies Config;
