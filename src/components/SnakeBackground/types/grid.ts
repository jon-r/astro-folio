import type {GridDirection} from "../constants/grid.ts";
import type {GridNode} from "../GridNode.ts";

export type GridPoint = [x: number, y: number];

export interface GridDimensions {
    rows: number;
    cols: number;
}

export interface GridNodeStarter extends GridNode {
    startDirection: GridDirection;
}

export interface GridState {
    size: GridDimensions;
    nextIndex: number;
    nodes: GridNode[];
}
