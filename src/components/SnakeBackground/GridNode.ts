import { Rng } from "../shared/Rng.js";
import { GRID_DIRECTION_VECTORS, GridDirection, POSSIBLE_DIRECTIONS } from "./constants/grid.js";
import type { GridDimensions, GridPoint } from "./types/grid.js";

export class GridNode {
  readonly id: string;
  readonly startDirection: GridDirection | null;
  #rng = new Rng();

  constructor(
    readonly point: GridPoint,
    dimensions: GridDimensions,
    // readonly owner: string | null = null,
  ) {
    this.startDirection = this.#getStartDirection(point, dimensions);
    this.id = point.toString();
  }

  #getStartDirection([x, y]: GridPoint, { rows, cols }: GridDimensions) {
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

  #getAdjacentNodePoint(direction: GridDirection): GridPoint {
    const arr2 = GRID_DIRECTION_VECTORS[direction];
    const [a1, b1] = this.point;
    const [a2, b2] = arr2;

    return [a1 + a2, b1 + b2];
  }

  getRandomAdjacentNode(currentDirection: GridDirection) {
    const possibleDirections = [...POSSIBLE_DIRECTIONS[currentDirection]];
    const nextDirection = this.#rng.randomFrom(possibleDirections, 1, 10);
    const nextPoint = this.#getAdjacentNodePoint(nextDirection);

    return {
      nextDirection,
      nextPoint,
    };
  }

  isWithin(possibleNodes: GridNode[]) {
    return possibleNodes.find(node => node.id === this.id);
  }

  isStarterNode() {
    return this.startDirection !== null;
  }
}
