import { isNotUndefined } from "../../util/generics.js";
import type { ApplesManager } from "./ApplesManager.js";
import type { SnakeColours } from "./constants/colours.js";
import { GridDirection } from "./constants/grid.js";
import { SnakeStatus } from "./constants/snake.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";
import type { GridNodeStarter } from "./types/grid.js";
import { Logger } from "../shared/Logger.js";
import type { SnakeParts } from "./types/snakes.js";

export interface SnakeProps {
  logger: Logger;
  colours: SnakeColours;
  startingLength: number;
  targetLength: number;
}

export class Snake {
  readonly #props: SnakeProps;

  colours: SnakeColours;
  targetLength: number;
  #direction: GridDirection;
  #parts: GridNode[];

  status = SnakeStatus.Ok;

  constructor(startingNode: GridNodeStarter, props: SnakeProps, readonly id: string) {
    const { targetLength, colours } = props;
    this.#props = props;

    this.colours = colours;
    this.targetLength = targetLength;
    this.#direction = startingNode.startDirection;
    this.#parts = [startingNode];

    this.#props.logger.log(
      `Snake ${id} Started at ${startingNode.id}. Going ${GridDirection[startingNode.startDirection!]}`,
    );
  }

  getSnakeAsParts(): SnakeParts {
    const [...body] = this.#parts;
    const end = body.splice(this.targetLength);
    const head = body.shift();

    this.#parts = [head, ...body].filter(isNotUndefined);

    return {
      colours: this.colours,
      head,
      body,
      end,
    };
  }

  moveSnake(nodeProps: GridNodeProps) {
    if (this.status === SnakeStatus.Dying) {
      this.targetLength = this.targetLength - 1;

      if (this.targetLength <= 0) {
        this.status = SnakeStatus.Dead;
      }

      return;
    }

    const { nextDirection, nextPoint } = this.#getNextPoint();

    this.#direction = nextDirection;
    this.#parts.unshift(
      new GridNode(nextPoint, nodeProps),
    );
  }

  handleCollisions(fatalNodes: GridNode[], applesManager: ApplesManager) {
    const head = this.#parts[0];
    const snakeWillDie = head?.isWithin(fatalNodes);

    if (snakeWillDie) {
      this.#props.logger.log(`Snake ${this.id} collided! at ${head?.id}`);

      this.status = SnakeStatus.Dying;

      return;
    }

    const snakeAteApple = applesManager.apples.find(
      (apple) => apple.id === head?.id,
    );

    if (snakeAteApple) {
      this.targetLength += this.#props.startingLength;
      applesManager.destroyApple(snakeAteApple.id);
    }
  }

  getEdgeCollision(edgeNodes: GridNode[]) {
    const edgeHit = this.#parts[0]?.isWithin(edgeNodes);

    if (edgeHit) {
      this.#props.logger.log(`Snake ${this.id} hit Edge. Going ${GridDirection[this.#direction!]}`);
    }

    return edgeHit;
  }

  #getNextPoint() {
    const head = this.#parts[0];

    if (!head) {
      throw new Error(
        `Bad Snake, ${JSON.stringify({ head })}`,
      );
    }

    const currentDirection = this.#direction;
    const adjacentNode = head.getRandomAdjacentNode(currentDirection);

    if (currentDirection !== adjacentNode.nextDirection) {
      this.#props.logger.log(
        `Snake ${this.id} now going ${GridDirection[adjacentNode.nextDirection]}`,
      );
    }

    return adjacentNode;
  }
}
