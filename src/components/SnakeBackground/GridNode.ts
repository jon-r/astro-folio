import {GRID_DIRECTION_VECTORS, GridDirection, NO_TURN_BIAS, POSSIBLE_DIRECTIONS} from "./constants/grid.js";
import type { Rng } from "./shared/Rng.js";
import type { GridDimensions, GridPoint } from "./types/grid.js";
import type {GridOptions} from "./types/config.js";
import {isFactorOf} from "../../util/generics.ts";

export interface GridNodeProps extends GridOptions {
  rng: Rng;
  dimensions: GridDimensions;
}

export class GridNode {
  readonly #props: GridNodeProps;

  readonly id: string;
  readonly startDirection: GridDirection | null;

  constructor(
    readonly point: GridPoint,
    props: GridNodeProps,
  ) {
    this.#props = props;
    this.startDirection = this.#getStartDirection(point, props.dimensions);
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

  #getNextDirection(currentDirection: GridDirection) {
    const {spacing, rng} = this.#props
    const [x,y] = this.point;
    const isFactor = isFactorOf(spacing);

    if (!isFactor(x) || !isFactor(y)) {
      return currentDirection;
    }

    return rng.from(
      [currentDirection, ...POSSIBLE_DIRECTIONS[currentDirection]],
      0,
      NO_TURN_BIAS,
    );
  }

  #getAdjacentNodePoint(direction: GridDirection): GridPoint {
    const arr2 = GRID_DIRECTION_VECTORS[direction];
    const [a1, b1] = this.point;
    const [a2, b2] = arr2;

    return [a1 + a2, b1 + b2];
  }

  getNextNode(currentDirection: GridDirection) {
    const nextDirection = this.#getNextDirection(currentDirection);
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
