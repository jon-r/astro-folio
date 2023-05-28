import {Snake} from "./Snake.js";
import {randomFrom} from "../../util/number.js";
import type {GridNode, GridNodeProps} from "./GridNode.js";
import {SnakeColours} from "./constants.js";

interface SnakesProps {
  // starterNodes: GridNode[];
  snakeStartingLength: number;
  maxSnakes: number;
}

export class Snakes {
  readonly #props: SnakesProps;

  #snakes: Snake[] = [];
  #nextSnakeId: number = 0;

  constructor(props: SnakesProps) {
    this.#props = props;
  }

  addNewSnake(starterNodes: GridNode[]) {
    if (this.#snakes.length > this.#props.maxSnakes) {
      return;
    }

    this.#nextSnakeId = (this.#nextSnakeId + 1) % this.#props.maxSnakes;

    this.#snakes.push(
      new Snake({
        startingNode: randomFrom(starterNodes),
        startingLength: this.#props.snakeStartingLength,
        id: String(this.#nextSnakeId),
      })
    );
  }

  controlSnakes(nodeProps: GridNodeProps, starterNodes: GridNode[]) {
    const rendered: Record<SnakeColours, GridNode[]> = {
      [SnakeColours.Background]: [],
      [SnakeColours.Head]: [],
      [SnakeColours.Body]: [],
      [SnakeColours.Tail]: [],
    };
    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(nodeProps);

      const snakeParts = snake.getSnakeAsParts();

      if (snakeParts.head) {
          const colour = snake.isDying ? SnakeColours.Background : SnakeColours.Head;
        rendered[colour].push(snakeParts.head);
      }

      rendered[SnakeColours.Background].push(...snakeParts.end);
      rendered[SnakeColours.Body].push(...snakeParts.body);
      rendered[SnakeColours.Tail].push(...snakeParts.tail);
      activeNodes.push(...snakeParts.body, ...snakeParts.tail);
    });

    this.#snakes.forEach((snake) => {
      // todo have it go off the opposite side if it hits a wall
      snake.handleCollisions([...activeNodes, ...starterNodes]);
    });

    this.#snakes = [...this.#snakes].filter((snake) => !snake.isDead);

    return rendered;
  }
}
