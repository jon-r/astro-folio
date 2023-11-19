import type { GridPoint } from "../GridNode.js";

export enum GridDirection {
  Up,
  Right,
  Down,
  Left,
}

export interface SnakeColours {
  body: string;
  head: string;
}

const snakeColoursGreen: SnakeColours = {
  body: "#141",
  head: "#3A3",
};

const snakeColoursRed: SnakeColours = {
  body: "#411",
  head: "#A33",
};

const snakeColoursBlue: SnakeColours = {
  body: "#114",
  head: "#33A",
};

export const SNAKE_COLOURS: [SnakeColours, SnakeColours, SnakeColours] = [
  snakeColoursRed,
  snakeColoursGreen,
  snakeColoursBlue,
];

export const enum SnakeStatus {
  Ok,
  Dying,
  Dead,
}

export const APPLE_COLOUR = "#530356";
export const BACKGROUND_COLOUR = "#111";

type PossibleDirections = [GridDirection, GridDirection, GridDirection];

export const POSSIBLE_DIRECTIONS: Record<GridDirection, PossibleDirections> = {
  [GridDirection.Up]: [GridDirection.Left, GridDirection.Up, GridDirection.Right],
  [GridDirection.Right]: [GridDirection.Up, GridDirection.Right, GridDirection.Down],
  [GridDirection.Down]: [GridDirection.Right, GridDirection.Down, GridDirection.Left],
  [GridDirection.Left]: [GridDirection.Down, GridDirection.Left, GridDirection.Up],
};

interface OppositeEdgeInfo {
  direction: GridDirection;
  matchingCoordinate: 0 | 1;
}

export const OPPOSITE_EDGES: Record<GridDirection, OppositeEdgeInfo> = {
  [GridDirection.Up]: { direction: GridDirection.Down, matchingCoordinate: 0 },
  [GridDirection.Right]: { direction: GridDirection.Left, matchingCoordinate: 1 },
  [GridDirection.Down]: { direction: GridDirection.Up, matchingCoordinate: 0 },
  [GridDirection.Left]: { direction: GridDirection.Right, matchingCoordinate: 1 },
};

export const GRID_DIRECTION_VECTORS: Record<GridDirection, GridPoint> = {
  [GridDirection.Up]: [0, -1],
  [GridDirection.Right]: [1, 0],
  [GridDirection.Down]: [0, 1],
  [GridDirection.Left]: [-1, 0],
};
