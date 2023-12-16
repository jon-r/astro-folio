import type { SnakeColours } from "../constants/colours.js";
import type { GridNode } from "../GridNode.js";
import type { SnakeProps } from "../Snake.js";

export interface SnakeParts {
  colours: SnakeColours;
  head: GridNode | undefined;
  body: GridNode[];
  end: GridNode[];
}

export type SnakeSpawnProps = Partial<SnakeProps>;
