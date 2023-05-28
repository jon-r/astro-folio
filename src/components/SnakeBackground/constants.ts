import type { GridPoint } from "./GridNode.js";

export enum GridDirection {
  Up,
  Right,
  Down,
  Left,
}

export enum SnakeColours {
  Background = "#111",
  Tail = "#066",
  Body = "#0cc",
  Head = "#0ff",
}

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

export const gridDirectionVector: Record<GridDirection, GridPoint> = {
  [GridDirection.Up]: [0, -1],
  [GridDirection.Right]: [1, 0],
  [GridDirection.Down]: [0, 1],
  [GridDirection.Left]: [-1, 0],
};
