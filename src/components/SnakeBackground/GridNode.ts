import { GridDirection } from "./helpers/constants.js";

export type GridPoint = [x: number, y: number];

export interface GridNodeProps {
  rows: number;
  cols: number;
}

export class GridNode {
  readonly id: string;
  readonly startDirection: GridDirection | null;

  constructor(
    readonly point: GridPoint,
    props: GridNodeProps,
    readonly owner: string | null = null,
  ) {
    this.startDirection = this.#getStartDirection(point, props);
    this.id = point.toString();
  }

  #getStartDirection([x, y]: GridPoint, { rows, cols }: GridNodeProps) {
    if (x === 0) {
      return GridDirection.Right;
    }
    if (y === 0) {
      return GridDirection.Down;
    }
    if (x === cols - 1) {
      return GridDirection.Left;
    }
    if (y === rows - 1) {
      return GridDirection.Up;
    }

    return null;
  }
}
