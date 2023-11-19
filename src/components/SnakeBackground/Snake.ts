import {GridDirection, gridDirectionVector, POSSIBLE_DIRECTIONS, SnakeStatus} from "./constants.js";
import {GridNode, type GridNodeProps} from "./GridNode.js";

import {isNotUndefined} from "../../util/generics.js";
import {debugToConsole} from "../../util/logger.js";
import {addVectors, biasedRNG} from "../../util/number.js";
import type {ApplesManager} from "./ApplesManager.js";

interface SnakeProps {
  startingNode: GridNode;
  startingLength: number;
  targetLength: number;
}

interface SnakeParts {
  head: GridNode | undefined;
  body: GridNode[];
  // tail: GridNode[];
  end: GridNode[];
}

export class Snake {
  readonly #props: SnakeProps;

  #targetLength: number;
  #direction: GridDirection | null;
  #parts: GridNode[];
  #iterator = 0;

  status = SnakeStatus.Ok

  constructor(props: SnakeProps, readonly snakeId: string) {
    const { startingNode, targetLength } = props;
    this.#props = props;

    this.#targetLength = targetLength;
    this.#direction = startingNode.startDirection;
    this.#parts = [startingNode];

    debugToConsole.log(
      `Snake ${snakeId} Started at ${startingNode.pointStr}. Going ${GridDirection[startingNode.startDirection!]}`,
    );
  }

  getSnakeAsParts(): SnakeParts {
    const [...body] = this.#parts;
    const end = body.splice(this.#targetLength);
    const head = body.shift();

    this.#parts = [head, ...body].filter(isNotUndefined);

    return {
      head,
      body,
      // tail,
      end,
    };
  }

  moveSnake(nodeProps: GridNodeProps) {
    if (this.status === SnakeStatus.Dying) {
      this.#targetLength = this.#targetLength - 1;

      if (this.#targetLength <= 0) {
        this.status = SnakeStatus.Dead;
      }

      return;
    }

    const { nextDirection, nextPoint } = this.#getNextPoint();

    this.#iterator = (this.#iterator + 1) % (this.#targetLength * 2);
    this.#direction = nextDirection;
    this.#parts.unshift(
      new GridNode(nextPoint, nodeProps, `snake-${this.snakeId}-${this.#iterator}`),
    );
  }

  handleCollisions(fatalNodes: GridNode[], applesManager: ApplesManager) {
    const head = this.#parts[0];

    const snakeWillDie = fatalNodes.some(
      (node) => node.nodeOwner !== head?.nodeOwner && node.pointStr === head?.pointStr,
    );

    if (snakeWillDie) {
      debugToConsole.log(`Snake ${this.snakeId} collided! at ${head?.pointStr}`);

      console.log(this.#parts.map(p => p.nodeOwner))

      this.status = SnakeStatus.Dying;

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
    const head = this.#parts[0];
    const edgeHit = edgeNodes.find(node => node.pointStr === head!.pointStr);

    if (edgeHit) {
      debugToConsole.log(`Snake ${this.snakeId} hit Edge. Going ${GridDirection[this.#direction!]}`, edgeHit);
    }

    return edgeHit;
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
      debugToConsole.log(
        `Snake ${this.snakeId} now going ${GridDirection[nextDirection]}`,
      );
    }

    return {
      nextDirection,
      nextPoint: addVectors(head.point, gridDirectionVector[nextDirection]),
    };
  }
}
