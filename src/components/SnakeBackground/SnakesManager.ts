import type { ApplesManager } from "./ApplesManager.js";
import { BACKGROUND_COLOUR, SNAKE_HUES, type SnakeColours } from "./constants/colours.js";
import { OPPOSITE_EDGES } from "./constants/grid.js";
import { SnakeStatus } from "./constants/snake.js";
import type { GridNode, GridNodeProps } from "./GridNode.js";
import { IdMaker } from "./shared/IdMaker.js";
import type { Logger } from "./shared/Logger.js";
import type { Rng } from "./shared/Rng.js";
import { Snake } from "./Snake.js";
import type { GridNodeStarter } from "./types/grid.js";
import type { SnakeSpawnProps } from "./types/snakes.js";

interface SnakesManagerProps {
  spawnChance: number;
  max: number;
  startingLength: number;
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

  maybeAddNewSnake(availableNodes: GridNodeStarter[]) {
    const { max, spawnChance, rng } = this.#props;
    const willSpawn = this.#snakes.length < max && rng.randomFlip(spawnChance);

    if (!willSpawn) {
      return;
    }
    const newNode = rng.randomFrom(availableNodes);

    return this.#handleSpawnSnake(newNode);
  }

  #getRandomSnakeColours = (): SnakeColours => {
    const hue = this.#props.rng.randomFrom(SNAKE_HUES);

    return {
      head: `hsl(${hue},80%,15%)`,
      body: `hsl(${hue},85%,10%)`,
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

  moveSnakes(nodeProps: GridNodeProps) {
    const rendered: Record<string, GridNode[]> = {};

    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(nodeProps);

      const { head, body, colours, end } = snake.getSnakeAsParts();

      const headColour = snake.status === SnakeStatus.Dying ? colours.body : colours.head;

      const entries: [color: string, node: GridNode[]][] = [
        [headColour, head ? [head] : []],
        [colours.body, body],
        [BACKGROUND_COLOUR, end],
      ];

      entries.forEach(([colour, nodes]) => {
        const existingNodes = rendered[colour] || [];
        rendered[colour] = [...existingNodes, ...nodes];
      });

      activeNodes.push(...body);
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
