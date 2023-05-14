// order is important here to go clockwise
import type { GridPoint } from "./GridNode.js";

export enum GridDirection {
  Up,
  Right,
  Down,
  Left,
}

export const ALL_DIRECTIONS: number[] =
  Object.values(GridDirection).map(Number);

export enum GridColours {
  Background = "#111",
  Up = "#0f0",
  Right = "#f00",
  Down = "#ff0",
  Left = "#00f",

  Tail = "#066",
  Body = "#0cc",
  Head = "#0ee",
}

// definitely a better way of calculating this - think the enum values make it work? check OG code
export const possibleDirectionsList: Record<
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
