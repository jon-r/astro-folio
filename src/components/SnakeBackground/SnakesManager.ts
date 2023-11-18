import { randomFrom } from "../../util/number.js";
import type { ApplesManager } from "./ApplesManager.js";
import { SnakeColours } from "./constants.js";
import type { GridNode, GridNodeProps } from "./GridNode.js";
import { MaybeSpawn, type MaybeSpawnProps } from "./MaybeSpawn.js";
import { Snake } from "./Snake.js";

interface SnakesProps extends MaybeSpawnProps {
  // starterNodes: GridNode[];
  // spawnChance: number;
  snakeStartingLength: number;
  // maxSnakes: number;
}

export class SnakesManager extends MaybeSpawn {
  readonly #props: SnakesProps;

  #snakes: Snake[] = [];
  #nodeProps: GridNodeProps = { rows: 0, cols: 0 };
  #nextSnakeId: number = 0;

  activeNodes: GridNode[] = [];

  constructor(props: SnakesProps) {
    super(props);

    this.#props = props;
  }

  maybeAddNewSnake(starterNodes: GridNode[]) {
    if (!this.maybeSpawn(this.#snakes.length)) {
      return;
    }

    this.#nextSnakeId = (this.#nextSnakeId + 1) % this.#props.maxItems;

    this.#snakes.push(
      new Snake({
        startingNode: randomFrom(starterNodes),
        startingLength: this.#props.snakeStartingLength,
        id: String(this.#nextSnakeId),
      }),
    );
  }

  setNodeProps(nodeProps: GridNodeProps) {
    this.#nodeProps = nodeProps;
  }

  updateSnakePosition() {
    const rendered: Record<SnakeColours, GridNode[]> = {
      [SnakeColours.Background]: [],
      [SnakeColours.Head]: [],
      [SnakeColours.Body]: [],
      [SnakeColours.Tail]: [],
    };
    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(this.#nodeProps);

      const snakeParts = snake.getSnakeAsParts();

      if (snakeParts.head) {
        const colour = snake.isDying ? SnakeColours.Body : SnakeColours.Head;
        rendered[colour].push(snakeParts.head);
      }

      rendered[SnakeColours.Background].push(...snakeParts.end);
      rendered[SnakeColours.Body].push(...snakeParts.body);
      rendered[SnakeColours.Tail].push(...snakeParts.tail);
      activeNodes.push(...snakeParts.body, ...snakeParts.tail);
    });

    this.activeNodes = activeNodes;

    return rendered;
  }

  handleCollisions(starterNodes: GridNode[], apples: ApplesManager) {
    this.#snakes.forEach((snake) => {
      // todo have it go off the opposite side if it hits a wall
      snake.handleCollisions(
        [...this.activeNodes, ...starterNodes],
        apples,
      );
    });

    this.#snakes = [...this.#snakes].filter((snake) => !snake.isDead);
  }
}
