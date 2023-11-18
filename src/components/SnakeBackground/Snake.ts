import { GridDirection } from "./constants.js";
import { gridDirectionVector, POSSIBLE_DIRECTIONS } from "./constants.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";

import { isNotUndefined } from "../../util/generics.js";
import { addVectors, biasedRNG } from "../../util/number.js";
import type { ApplesManager } from "./ApplesManager.js";

interface SnakeProps {
  // id: string;
  startingNode: GridNode;
  startingLength: number;
  targetLength: number;
}

interface SnakeParts {
  head: GridNode | undefined;
  body: GridNode[];
  tail: GridNode[];
  end: GridNode[];
}

export class Snake {
  readonly #props: SnakeProps;

  #targetLength: number;
  #direction: GridDirection | null;
  #parts: GridNode[];
  #iterator = 0;

  isDying = false;
  isDead = false;

  constructor(props: SnakeProps, readonly snakeId: string) {
    const { startingNode, targetLength } = props;
    this.#props = props;

    this.#targetLength = targetLength;
    this.#direction = startingNode.startDirection;
    this.#parts = [startingNode];

    console.log(
      `Snake ${snakeId} Started at ${startingNode.pointStr}. Going ${GridDirection[startingNode.startDirection!]}`,
    );
  }

  getSnakeAsParts(): SnakeParts {
    const [...body] = this.#parts;
    const end = body.splice(this.#targetLength);
    const tail = body.splice(this.#parts.length - 3);
    const head = body.shift();

    this.#parts = [head, ...body, ...tail].filter(isNotUndefined);

    return {
      head,
      body,
      tail,
      end,
    };
  }

  getFullSnake(): GridNode[] {
    return this.#parts;
  }

  moveSnake(nodeProps: GridNodeProps) {
    if (this.isDying) {
      this.#targetLength = this.#targetLength - 1;
      this.isDead = this.#targetLength <= 0;

      return;
    }

    const { nextDirection, nextPoint } = this.#getNextPoint();

    this.#iterator++;
    this.#direction = nextDirection;
    this.#parts.unshift(
      new GridNode(nextPoint, nodeProps, `${this.snakeId}-${this.#iterator}`),
    );
  }

  handleCollisions(fatalNodes: GridNode[], applesManager: ApplesManager) {
    if (this.isDying) {
      return;
    }

    const head = this.#parts[0];

    const snakeWillDie = fatalNodes.some(
      (node) => node.nodeOwner !== head?.nodeOwner && node.pointStr === head?.pointStr,
    );

    if (snakeWillDie) {
      console.log(`Snake ${this.snakeId} collided! at ${head?.pointStr}`);
      this.isDying = true;

      return;
    }

    const snakeAteApple = applesManager.apples.find(
      (apple) => apple.id === head?.pointStr,
    );

    if (snakeAteApple) {
      this.#targetLength += this.#props.startingLength;
      applesManager.destroyApple(snakeAteApple.id);
    }
  }

  getEdgeCollision(edgeNodes: GridNode[]) {
    if (this.isDying) {
      return;
    }
    const head = this.#parts[0];
    const edgeHit = edgeNodes.find(node => node.pointStr === head!.pointStr);

    if (edgeHit) {
      console.log(`Snake ${this.snakeId} hit Edge. Going ${GridDirection[this.#direction!]}`, edgeHit);
    }

    return edgeHit;
    // if (edgeNodes.this.#parts[0].pointStr)
  }

  getFullLength() {
    return this.#targetLength;
  }

  #getNextPoint() {
    const head = this.#parts[0];
    const currentDirection = this.#direction;

    if (!head || currentDirection === null) {
      throw new Error(
        `Bad Snake, ${JSON.stringify({ currentDirection, head })}`,
      );
    }

    const possibleDirections = POSSIBLE_DIRECTIONS[currentDirection];
    const nextDirection = biasedRNG(possibleDirections, 1, 50);

    if (currentDirection !== nextDirection) {
      console.log(
        `Snake ${this.snakeId} now going ${GridDirection[nextDirection]}`,
      );
    }

    return {
      nextDirection,
      nextPoint: addVectors(head.point, gridDirectionVector[nextDirection]),
    };
  }
}
