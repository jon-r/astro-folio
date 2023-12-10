import type { SnakeColours } from "../constants/colours.js";
import type { GridNode } from "../GridNode.ts";

export interface SnakeParts {
  version: SnakeColours;
  head: GridNode | undefined;
  body: GridNode[];
  end: GridNode[];
}
