import type {GridConfig} from "./types/config.js";

export const gridOptions = {
  rectHeight: 10,
  rectWidth: 10,
  gridSpacing: 1,
  snakeSpeedMs: 1000 / 25,
  maxSnakes: 10,
  maxApples: 20,
  snakeStartingLength: 10,
  snakeSpawnChance: 50,
  appleSpawnChance: 10,
};

export type GridOptions = typeof gridOptions;

// todo have this as defaults, and pass in overrides from window
export const GRID_CONFIG: GridConfig = {
  grid: {
    size: 10,
    spacing: 1,
  },
  snakes: {
    speedMs: 1000 / 25,
    max: 10,
    startingLength: 10,
    spawnChance: 50,
  },
  apples: {
    max: 20,
    spawnChance: 10
  }
}