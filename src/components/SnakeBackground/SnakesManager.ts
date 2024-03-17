import type { ApplesManager } from "./ApplesManager.js";
import { GRID_COLOUR, SNAKE_HUES, type SnakeColours } from "./constants/colours.js";
import { OPPOSITE_EDGES } from "./constants/grid.js";
import { SnakeStatus } from "./constants/snake.js";
import type { GridNode, GridNodeProps } from "./GridNode.js";
import { IdMaker } from "./shared/IdMaker.js";
import type { Logger } from "./shared/Logger.js";
import type { Rng } from "./shared/Rng.js";
import { Snake } from "./Snake.js";
import type { SnakesOptions } from "./types/config.js";
import type { GridNodeStarter } from "./types/grid.js";
import type { SnakeSpawnProps } from "./types/snakes.js";

interface SnakesManagerProps extends SnakesOptions {
  logger: Logger;
  rng: Rng;
}

export class SnakesManager {
  readonly #props: SnakesManagerProps;
  readonly #idMaker: IdMaker;

  #snakes: Snake[] = [];
  activeNodes: GridNode[] = [];

  constructor(props: SnakesManagerProps) {
    this.#props = props;
    this.#idMaker = new IdMaker(props.max);
  }

  add(availableNodes: GridNodeStarter[]) {
    const { max, spawnChance, rng } = this.#props;
    const livingSnakes = this.#snakes.filter(snake => snake.status === SnakeStatus.Ok);
    const willSpawn = livingSnakes.length < max && rng.flip(spawnChance);

    if (!willSpawn) {
      return;
    }
    const newNode = rng.from(availableNodes);

    return this.#handleSpawnSnake(newNode);
  }

  #getRandomSnakeColours = (): SnakeColours => {
    const hue = this.#props.rng.from(SNAKE_HUES);

    return {
      head: `hsl(${hue},70%,30%)`,
      body: `hsl(${hue},80%,15%)`,
    };
  };

  #handleSpawnSnake = (startingNode: GridNodeStarter, spawnProps: SnakeSpawnProps = {}) => {
    const { logger, startingLength } = this.#props;
    const snakeId = this.#idMaker.getNextId();

    const newSnake = new Snake(startingNode, {
      colours: this.#getRandomSnakeColours(),
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

    const { direction, coord } = OPPOSITE_EDGES[oldNode.startDirection];
    const matchingPoint = oldNode.point[coord];

    return starterNodes.find(({ point, startDirection }) =>
      point[coord] === matchingPoint && startDirection === direction
    );
  }

  move(nodeProps: GridNodeProps) {
    const rendered: Record<string, GridNode[]> = {};

    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(nodeProps);

      const { head, body, colours, end } = snake.getSnakeAsParts();
      activeNodes.push(...body);

      const headColour = snake.status === SnakeStatus.Dying ? colours.body : colours.head;

      const entries: [color: string, node: GridNode[]][] = [
        [headColour, head ? [head] : []],
        [colours.body, body],
        [GRID_COLOUR, end],
      ];

      entries.forEach(([colour, nodes]) => {
        const existingNodes = rendered[colour] || [];
        rendered[colour] = [...existingNodes, ...nodes];
      });
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
              colours: snake.colours,
            });
          }
        }
      });

    this.#snakes = [...this.#snakes].filter((snake) => snake.status !== SnakeStatus.Dead);
  };
}
