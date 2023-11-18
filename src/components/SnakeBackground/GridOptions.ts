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
