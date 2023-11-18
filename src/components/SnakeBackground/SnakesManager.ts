import { randomFrom } from "../../util/number.js";
import type { ApplesManager } from "./ApplesManager.js";
import {OPPOSITE_EDGE, SnakeColours} from "./constants.js";
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
    if (!this.maybeSpawn(this.#snakes)) {
      return;
    }

    this.#spawnSnake(randomFrom(starterNodes), this.#props.snakeStartingLength);
  }

  #getOppositeStartingPoint(oldNode: GridNode, starterNodes: GridNode[]) {
    if (oldNode.startDirection === null) {
      throw new Error('collided with a non starter?')
    }

    const {direction, matchingCoordinate} = OPPOSITE_EDGE[oldNode.startDirection];

    return starterNodes.find(node => node.point[matchingCoordinate] === oldNode.point[matchingCoordinate] && node.startDirection === direction);
  }

  #spawnSnake(startingNode: GridNode, targetLength: number = this.#props.snakeStartingLength) {
    this.#nextSnakeId = (this.#nextSnakeId + 1) % (this.#props.maxItems*2);

    this.#snakes.push(
        new Snake({
          startingNode,
          targetLength,
          startingLength: this.#props.snakeStartingLength,
        }, String(this.#nextSnakeId))
    )
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
        const colour = SnakeColours.Body;
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
      const edgeCollision = snake.getEdgeCollision(starterNodes);

      snake.handleCollisions(
        [...this.activeNodes, ...starterNodes],
        apples,
      );

      if (edgeCollision) {
        const newPosition = this.#getOppositeStartingPoint(edgeCollision, starterNodes);

        if (newPosition) {
          console.log('respawning snake')
          // stops snakes respawning too small if the collide as they are going off the edge of the page
          // const startingLength = Math.max(snake.getMaxLength(), this.#props.snakeStartingLength);

          this.#spawnSnake(newPosition, snake.getFullLength())
        }
      }
    });

    this.#snakes = [...this.#snakes].filter((snake) => !snake.isDead);
  }
}
