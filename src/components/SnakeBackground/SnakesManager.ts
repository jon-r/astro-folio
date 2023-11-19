import type { ApplesManager } from "./ApplesManager.js";
import type { GridNode, GridNodeProps } from "./GridNode.js";
import { OPPOSITE_EDGE, SnakeColours, SnakeStatus } from "./helpers/constants.js";
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
    }, String(this.#iterator));

    this.#snakes.push(
      newSnake,
    );

    return newSnake;
  };

  #getOppositeStartingPoint(oldNode: GridNode, starterNodes: GridNode[]) {
    if (oldNode.startDirection === null) {
      throw new Error("collided with a non starter?");
    }

    const { direction, matchingCoordinate } = OPPOSITE_EDGE[oldNode.startDirection];

    return starterNodes.find(node =>
      node.point[matchingCoordinate] === oldNode.point[matchingCoordinate] && node.startDirection === direction
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
    };

    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(this.#nodeProps);

      const snakeParts = snake.getSnakeAsParts();

      if (snakeParts.head) {
        const colour = snake.status === SnakeStatus.Dying ? SnakeColours.Body : SnakeColours.Head;
        rendered[colour].push(snakeParts.head);
      }

      rendered[SnakeColours.Background].push(...snakeParts.end);
      rendered[SnakeColours.Body].push(...snakeParts.body);
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
