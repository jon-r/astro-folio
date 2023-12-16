import type { GridPoint } from "../types/grid.js";

export enum GridDirection {
  Up,
  Right,
  Down,
  Left,
}

type PossibleDirections = [GridDirection, GridDirection, GridDirection];

export const POSSIBLE_DIRECTIONS: Record<GridDirection, PossibleDirections> = {
  [GridDirection.Up]: [GridDirection.Left, GridDirection.Up, GridDirection.Right],
  [GridDirection.Right]: [GridDirection.Up, GridDirection.Right, GridDirection.Down],
  [GridDirection.Down]: [GridDirection.Right, GridDirection.Down, GridDirection.Left],
  [GridDirection.Left]: [GridDirection.Down, GridDirection.Left, GridDirection.Up],
};

interface OppositeEdgeInfo {
  direction: GridDirection;
  coord: 0 | 1;
}

export const OPPOSITE_EDGES: Record<GridDirection, OppositeEdgeInfo> = {
  [GridDirection.Up]: { direction: GridDirection.Down, coord: 0 },
  [GridDirection.Right]: { direction: GridDirection.Left, coord: 1 },
  [GridDirection.Down]: { direction: GridDirection.Up, coord: 0 },
  [GridDirection.Left]: { direction: GridDirection.Right, coord: 1 },
};

export const GRID_DIRECTION_VECTORS: Record<GridDirection, GridPoint> = {
  [GridDirection.Up]: [0, -1],
  [GridDirection.Right]: [1, 0],
  [GridDirection.Down]: [0, 1],
  [GridDirection.Left]: [-1, 0],
};
