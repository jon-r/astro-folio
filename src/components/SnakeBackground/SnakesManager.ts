import type { ApplesManager } from "./ApplesManager.js";
import type { GridNode, GridNodeProps } from "./GridNode.js";
import { BACKGROUND_COLOUR, SNAKE_COLOURS, SnakeStatus } from "./helpers/constants.js";
import { getOppositeStartingPoint } from "./helpers/grid.js";
import { loopIds } from "./helpers/rng.js";
import { MaybeSpawn, type MaybeSpawnProps } from "./MaybeSpawn.js";
import { Snake } from "./Snake.js";

interface SnakesProps extends MaybeSpawnProps {
  snakeStartingLength: number;
}

export class SnakesManager extends MaybeSpawn<Snake> {
  readonly #props: SnakesProps;

  #snakes: Snake[] = [];
  #nodeProps: GridNodeProps = { rows: 0, cols: 0 };
  #iterator = 0;

  activeNodes: GridNode[] = [];

  constructor(props: SnakesProps) {
    super(props);

    this.#props = props;
  }

  maybeAddNewSnake(availableNodes: GridNode[]) {
    return this.maybeSpawn(this.#snakes, this.#handleSpawnSnake, availableNodes);
  }

  #handleSpawnSnake = (startingNode: GridNode, targetLength: number = this.#props.snakeStartingLength) => {
    this.#iterator = loopIds(this.#iterator, this.#props.maxItems);

    const newSnake = new Snake(startingNode, {
      targetLength,
      startingLength: this.#props.snakeStartingLength,
      version: SNAKE_COLOURS[this.#iterator % 3]!,
    }, String(this.#iterator));

    this.#snakes.push(
      newSnake,
    );

    return newSnake;
  };

  #getOppositeStartingPoint(oldNode: GridNode, starterNodes: GridNode[]) {
    return getOppositeStartingPoint(oldNode, starterNodes);
  }

  setNodeProps(nodeProps: GridNodeProps) {
    this.#nodeProps = nodeProps;
  }

  updateSnakePosition() {
    const rendered: Record<string, GridNode[]> = {};

    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(this.#nodeProps);

      const snakeParts = snake.getSnakeAsParts();
      const { head: headColour, body: bodyColour } = snakeParts.version;

      if (snakeParts.head) {
        const colour = snake.status === SnakeStatus.Dying ? bodyColour : headColour;

        if (rendered[colour]) {
          rendered[colour]!.push(snakeParts.head);
        } else {
          rendered[colour] = [snakeParts.head];
        }
      }

      if (rendered[bodyColour]) {
        rendered[bodyColour]!.push(...snakeParts.body);
      } else {
        rendered[bodyColour] = snakeParts.body;
      }

      if (rendered[BACKGROUND_COLOUR]) {
        rendered[BACKGROUND_COLOUR]!.push(...snakeParts.end);
      } else {
        rendered[BACKGROUND_COLOUR] = snakeParts.end;
      }

      activeNodes.push(...snakeParts.body);
    });

    this.activeNodes = activeNodes;

    return rendered;
  }

  handleCollisions = (starterNodes: GridNode[], apples: ApplesManager) => {
    this.#snakes
      .filter((snake) => snake.status === SnakeStatus.Ok)
      .forEach((snake) => {
        const edgeCollision = snake.getEdgeCollision(starterNodes);

        snake.handleCollisions(
          [...this.activeNodes, ...starterNodes],
          apples,
        );

        if (edgeCollision) {
          const newPosition = this.#getOppositeStartingPoint(edgeCollision, starterNodes);

          if (newPosition) {
            this.#handleSpawnSnake(newPosition, snake.targetLength);
          }
        }
      });

    this.#snakes = [...this.#snakes].filter((snake) => snake.status !== SnakeStatus.Dead);
  };
}
