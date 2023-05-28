import { GridDirection } from "./constants.js";

export type GridPoint = [x: number, y: number];

export interface GridNodeProps {
  rows: number;
  cols: number;
}

export class GridNode {
  readonly nodeId: string | null;
  readonly pointStr: string;
  readonly startDirection: GridDirection | null;

  constructor(readonly point: GridPoint, props: GridNodeProps, nodeId?: string) {
    this.startDirection = this.#getStartDirection(point, props);
    this.nodeId = nodeId ?? null;
    this.pointStr = point.toString();
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
