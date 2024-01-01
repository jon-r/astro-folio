export interface DebugOptions {
  shouldLog: boolean;
}

export interface GridOptions {
  size: number;
  spacing: number;
}

export interface SnakesOptions {
  speedMs: number;
  max: number;
  startingLength: number;
  spawnChance: number;
}

export interface ApplesOptions {
  max: number;
  spawnChance: number;
}

export interface GridConfig {
  debug: DebugOptions;
  grid: GridOptions;
  snakes: SnakesOptions;
  apples: ApplesOptions;
}
