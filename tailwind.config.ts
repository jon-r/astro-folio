import type {Config} from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{astro,ts,tsx}",
  ],
  // todo colour palette to match old site? try to match the green?
  theme: {
    extend: {},
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
