import { IdMaker } from "../shared/IdMaker.js";
import type { Logger } from "../shared/Logger.js";
import { MaybeSpawn, type MaybeSpawnProps } from "../shared/MaybeSpawn.js";
import type { ApplesManager } from "./ApplesManager.js";
import { BACKGROUND_COLOUR, SNAKE_COLOURS } from "./constants/colours.js";
import { OPPOSITE_EDGES } from "./constants/grid.js";
import { SnakeStatus } from "./constants/snake.js";
import type { GridNode } from "./GridNode.js";
import { Snake } from "./Snake.js";
import type { GridDimensions, GridNodeStarter } from "./types/grid.js";
import type { SnakeSpawnProps } from "./types/snakes.js";

interface SnakesProps extends MaybeSpawnProps {
  startingLength: number;
  logger: Logger;
}

export class SnakesManager extends MaybeSpawn<Snake> {
  readonly #props: SnakesProps;

  #snakes: Snake[] = [];
  #nodeDimensions: GridDimensions = { rows: 0, cols: 0 };
  // #iterator = 0;
  #idMaker: IdMaker;

  activeNodes: GridNode[] = [];

  constructor(props: SnakesProps) {
    super(props);

    this.#props = props;
    this.#idMaker = new IdMaker(props.maxItems);
  }

  maybeAddNewSnake(availableNodes: GridNodeStarter[]) {
    return this.maybeSpawn(this.#snakes, this.#handleSpawnSnake, availableNodes);
  }

  #handleSpawnSnake = (startingNode: GridNodeStarter, spawnProps: SnakeSpawnProps = {}) => {
    const { logger, startingLength } = this.#props;
    const snakeId = this.#idMaker.getNextId();

    const newSnake = new Snake(startingNode, {
      version: SNAKE_COLOURS[snakeId % SNAKE_COLOURS.length]!,
      targetLength: startingLength,
      startingLength,
      logger,
      ...spawnProps,
    }, String(snakeId));

    this.#snakes.push(
      newSnake,
    );

    return newSnake;
  };

  #getOppositeStartingPoint(oldNode: GridNode, starterNodes: GridNodeStarter[]) {
    if (!oldNode || oldNode.startDirection === null) {
      throw new Error("collided with a non starter?");
    }

    const { direction, matchingCoordinate } = OPPOSITE_EDGES[oldNode.startDirection];
    const matchingPoint = oldNode.point[matchingCoordinate];

    return starterNodes.find(({point, startDirection}) =>
      point[matchingCoordinate] === matchingPoint && startDirection === direction
    );
  }

  setGridDimensions(nodeProps: GridDimensions) {
    this.#nodeDimensions = nodeProps;
  }

  updateSnakePosition() {
    const rendered: Record<string, GridNode[]> = {};

    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(this.#nodeDimensions);

      const snakeParts = snake.getSnakeAsParts();
      const { head: headColour, body: bodyColour } = snakeParts.version;

      // todo DRY all this out
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

  handleCollisions = (starterNodes: GridNodeStarter[], apples: ApplesManager) => {
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
            this.#handleSpawnSnake(newPosition, {
              targetLength: snake.targetLength,
              version: snake.version,
            });
          }
        }
      });

    this.#snakes = [...this.#snakes].filter((snake) => snake.status !== SnakeStatus.Dead);
  };
}
