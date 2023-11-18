import { GridDirection } from "./constants.js";
import { gridDirectionVector, POSSIBLE_DIRECTIONS } from "./constants.js";
import { GridNode, GridNodeProps } from "./GridNode.js";

import { isNotUndefined } from "../../util/generics.js";
import { addVectors, biasedRNG } from "../../util/number.js";
import type { ApplesManager } from "./ApplesManager.js";

interface SnakeProps {
  id: string;
  startingNode: GridNode;
  startingLength: number;
}

interface SnakeParts {
  head: GridNode | undefined;
  body: GridNode[];
  tail: GridNode[];
  end: GridNode[];
}

export class Snake {
  readonly #props: SnakeProps;

  #maxLength: number;
  #direction: GridDirection | null;
  #parts: GridNode[];
  #iterator = 0;

  isDying = false;
  isDead = false;

  constructor(props: SnakeProps) {
    const { startingLength, startingNode } = props;
    this.#props = props;
    this.#maxLength = startingLength;
    this.#direction = startingNode.startDirection;
    this.#parts = [startingNode];

    console.log(
      `Snake ${props.id} Started at ${startingNode.pointStr}. Going ${GridDirection[startingNode.startDirection!]}`,
    );
  }

  getSnakeAsParts(): SnakeParts {
    const [...body] = this.#parts;
    const end = body.splice(this.#maxLength);
    const tail = body.splice(this.#maxLength - 2);
    const head = body.shift();

    this.#parts = [head, ...body, ...tail].filter(isNotUndefined);

    return {
      head,
      body,
      tail,
      end,
    };
  }

  // todo
  //  keep to fixed length. grow if it eats an 'apple'

  moveSnake(nodeProps: GridNodeProps) {
    if (this.isDying) {
      this.#maxLength = this.#maxLength - 1;
      this.isDead = this.#maxLength <= 0;

      return;
    }

    const { nextDirection, nextPoint } = this.#getNextPoint();

    this.#iterator++;
    this.#direction = nextDirection;
    this.#parts.unshift(
      new GridNode(nextPoint, nodeProps, `${this.#props.id}-${this.#iterator}`),
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
      console.log(`Snake ${this.#props.id} collided! at ${head?.pointStr}`);
      this.isDying = true;

      return;
    }

    const snakeAteApple = applesManager.apples.find(
      (apple) => apple.id === head?.pointStr,
    );

    if (snakeAteApple) {
      this.#maxLength += this.#props.startingLength;
      applesManager.destroyApple(snakeAteApple.id);
    }
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
        `Snake ${this.#props.id} now going ${GridDirection[nextDirection]}`,
      );
    }

    return {
      nextDirection,
      nextPoint: addVectors(head.point, gridDirectionVector[nextDirection]),
    };
  }
}
