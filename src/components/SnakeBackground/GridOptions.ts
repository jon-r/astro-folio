import type { GridConfig } from "./types/config.js";

export const GRID_CONFIG: GridConfig = {
  debug: {
    shouldLog: false,
  },
  grid: {
    size: 10,
    spacing: 1,
  },
  snakes: {
    speedMs: 1000 / 20,
    max: 5,
    startingLength: 15,
    spawnChance: 10,
  },
  apples: {
    max: 20,
    spawnChance: 5,
  },
};
