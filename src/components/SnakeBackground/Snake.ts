import { GridNode, GridNodeProps, GridPoint } from "./GridNode.js";
import type { GridDirection } from "./constants.js";
import { gridDirectionVector, possibleDirectionsList } from "./constants.js";
import { biasedRNG } from "../../util/generics.js";

interface SnakeProps {
  startingNode: GridNode;
  startingLength: number;
}

interface SnakeParts {
  head: GridNode;
  body: GridNode[];
}

export class Snake {
  readonly #props: SnakeProps;

  #maxLength: number;
  #direction: GridDirection | null;
  #parts: GridNode[];

  constructor(props: SnakeProps) {
    const { startingLength, startingNode } = props;
    this.#props = props;
    this.#maxLength = startingLength;
    this.#direction = startingNode.startDirection;
    this.#parts = [startingNode];
  }

  getSnakeParts(): SnakeParts {
    const [head, ...body] = this.#parts;

    if (!head) {
      throw new Error(`Snake doesnt exist?, ${JSON.stringify(this.#parts)}`);
    }

    return {
      head,
      body,
    };
  }

  // todo
  //  kill if it hits wall or another snake (maybe need to trigger collision in parent?)
  //  keep to fixed length. grow if it eats an 'apple'

  moveSnake(nodeProps: GridNodeProps) {
    const { nextDirection, nextPoint } = this.#getNextPoint();

    this.#direction = nextDirection;
    this.#parts.unshift(new GridNode(nextPoint, nodeProps));
  }

  #getNextPoint() {
    const head = this.#parts[0];
    const currentDirection = this.#direction;

    if (!head || !currentDirection) {
      throw new Error(`Bad Snake, ${JSON.stringify({ currentDirection })}`);
    }

    const possibleDirections = possibleDirectionsList[currentDirection];
    const nextDirection = biasedRNG(possibleDirections, 1, 50);

    return {
      nextDirection,
      nextPoint: this.#addPoints(
        head.point,
        gridDirectionVector[nextDirection]
      ),
    };
  }

  #addPoints(arr1: GridPoint, arr2: GridPoint): GridPoint {
    const [a1, b1] = arr1;
    const [a2, b2] = arr2;

    return [a1 + a2, b1 + b2];
  }
}
