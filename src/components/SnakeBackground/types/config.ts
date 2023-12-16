interface DebugOptions {
  shouldLog: boolean;
}

interface GridOptions {
  size: number;
  spacing: number;
}

interface SnakeOptions {
  speedMs: number;
  max: number;
  startingLength: number;
  spawnChance: number;
}

interface AppleOptions {
  max: number;
  spawnChance: number;
}

export interface GridConfig {
  debug: DebugOptions;
  grid: GridOptions;
  snakes: SnakeOptions;
  apples: AppleOptions;
}
