import type { GridPoint } from "./GridNode.js";

export enum GridDirection {
  Up,
  Right,
  Down,
  Left,
}

export const enum SnakeColours {
  Background = "#111",
  Tail = "#022",
  Body = "#044",
  Head = "#066",
}
export const APPLE_COLOUR = "#530356";

export const POSSIBLE_DIRECTIONS: Record<
  GridDirection,
  [GridDirection, GridDirection, GridDirection]
> = {
  [GridDirection.Up]: [
    GridDirection.Left,
    GridDirection.Up,
    GridDirection.Right,
  ],
  [GridDirection.Right]: [
    GridDirection.Up,
    GridDirection.Right,
    GridDirection.Down,
  ],
  [GridDirection.Down]: [
    GridDirection.Right,
    GridDirection.Down,
    GridDirection.Left,
  ],
  [GridDirection.Left]: [
    GridDirection.Down,
    GridDirection.Left,
    GridDirection.Up,
  ],
};

interface OppositeEdgeInfo {
  direction: GridDirection;
  matchingCoordinate: 0 | 1;
}

export const OPPOSITE_EDGE: Record<GridDirection, OppositeEdgeInfo> = {
  [GridDirection.Up]: { direction: GridDirection.Down, matchingCoordinate: 0 },
  [GridDirection.Right]: { direction: GridDirection.Left, matchingCoordinate: 1 },
  [GridDirection.Down]: { direction: GridDirection.Up, matchingCoordinate: 0 },
  [GridDirection.Left]: { direction: GridDirection.Right, matchingCoordinate: 1 },
};

export const gridDirectionVector: Record<GridDirection, GridPoint> = {
  [GridDirection.Up]: [0, -1],
  [GridDirection.Right]: [1, 0],
  [GridDirection.Down]: [0, 1],
  [GridDirection.Left]: [-1, 0],
};
