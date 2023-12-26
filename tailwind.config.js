/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
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
};
