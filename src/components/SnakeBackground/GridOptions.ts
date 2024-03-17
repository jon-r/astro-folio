import type { GridConfig } from "./types/config.js";

export const GRID_CONFIG: GridConfig = {
  debug: {
    shouldLog: false,
  },
  grid: {
    size: 6,
    spacing: 16,
  },
  snakes: {
    speedMs: 1000 / 40,
    max: 2,
    startingLength: 30,
    spawnChance: 10,
  },
  apples: {
    max: 4,
    spawnChance: 2,
  },
};
