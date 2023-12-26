import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
// https://astro.build/config
export default defineConfig({
  // todo remove react if unused
  integrations: [react(), tailwind()],
  vite: {
    server: {
      watch: {
        ignored: ["**/.idea/**"],
      },
    },
  },
});
