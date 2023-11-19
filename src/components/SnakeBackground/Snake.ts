import { isNotUndefined } from "../../util/generics.js";
import type { ApplesManager } from "./ApplesManager.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";
import { GRID_DIRECTION_VECTOR, GridDirection, SnakeStatus } from "./helpers/constants.js";
import { addVectors, findNodeCollision, getNextValidDirection } from "./helpers/grid.js";
import { debugToConsole } from "./helpers/logger.js";
import { loopIds } from "./helpers/rng.js";

interface SnakeProps {
  startingLength: number;
  targetLength: number;
}

interface SnakeParts {
  head: GridNode | undefined;
  body: GridNode[];
  end: GridNode[];
}

export class Snake {
  readonly #props: SnakeProps;

  targetLength: number;
  #direction: GridDirection | null;
  #parts: GridNode[];
  #iterator = 0;

  status = SnakeStatus.Ok;

  constructor(startingNode: GridNode, props: SnakeProps, readonly id: string) {
    const { targetLength } = props;
    this.#props = props;

    this.targetLength = targetLength;
    this.#direction = startingNode.startDirection;
    this.#parts = [startingNode];

    debugToConsole.log(
      `Snake ${id} Started at ${startingNode.id}. Going ${GridDirection[startingNode.startDirection!]}`,
    );
  }

  getSnakeAsParts(): SnakeParts {
    const [...body] = this.#parts;
    const end = body.splice(this.targetLength);
    const head = body.shift();

    this.#parts = [head, ...body].filter(isNotUndefined);

    return {
      head,
      body,
      end,
    };
  }

  moveSnake(nodeProps: GridNodeProps) {
    if (this.status === SnakeStatus.Dying) {
      this.targetLength = this.targetLength - 1;

      if (this.targetLength <= 0) {
        this.status = SnakeStatus.Dead;
      }

      return;
    }

    const { nextDirection, nextPoint } = this.#getNextPoint();

    this.#iterator = loopIds(this.#iterator, this.targetLength);
    this.#direction = nextDirection;
    this.#parts.unshift(
      new GridNode(nextPoint, nodeProps, `snake-${this.id}-${this.#iterator}`),
    );
  }

  handleCollisions(fatalNodes: GridNode[], applesManager: ApplesManager) {
    const head = this.#parts[0];
    const snakeWillDie = findNodeCollision(head, fatalNodes);

    if (snakeWillDie) {
      debugToConsole.log(`Snake ${this.id} collided! at ${head?.id}`);

      this.status = SnakeStatus.Dying;

      return;
    }

    const snakeAteApple = applesManager.apples.find(
      (apple) => apple.id === head?.id,
    );

    if (snakeAteApple) {
      this.targetLength += this.#props.startingLength;
      applesManager.destroyApple(snakeAteApple.id);
    }
  }

  getEdgeCollision(edgeNodes: GridNode[]) {
    const head = this.#parts[0];
    const edgeHit = findNodeCollision(head, edgeNodes);

    if (edgeHit) {
      debugToConsole.log(`Snake ${this.id} hit Edge. Going ${GridDirection[this.#direction!]}`);
    }

    return edgeHit;
  }

  #getNextPoint() {
    const head = this.#parts[0];
    const currentDirection = this.#direction;

    if (!head || currentDirection === null) {
      throw new Error(
        `Bad Snake, ${JSON.stringify({ currentDirection, head })}`,
      );
    }

    const nextDirection = getNextValidDirection(currentDirection);

    if (currentDirection !== nextDirection) {
      debugToConsole.log(
        `Snake ${this.id} now going ${GridDirection[nextDirection]}`,
      );
    }

    return {
      nextDirection,
      nextPoint: addVectors(head.point, GRID_DIRECTION_VECTOR[nextDirection]),
    };
  }
}
