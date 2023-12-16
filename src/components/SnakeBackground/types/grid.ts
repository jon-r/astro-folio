import type { GridDirection } from "../constants/grid.js";
import type { GridNode } from "../GridNode.js";

export type GridPoint = [x: number, y: number];

export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface GridNodeStarter extends GridNode {
  startDirection: GridDirection;
}
