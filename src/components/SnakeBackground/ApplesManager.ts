import { Logger } from "../shared/Logger.js";
import type { Rng } from "../shared/Rng.js";
import { Apple } from "./Apple.js";
import type { GridNode } from "./GridNode.js";

interface ApplesManagerProps {
  spawnChance: number;
  max: number;
  logger: Logger;
  rng: Rng;
}

export class ApplesManager {
  readonly #props: ApplesManagerProps;

  apples: Apple[] = [];

  constructor(props: ApplesManagerProps) {
    this.#props = props;
  }

  maybeAddNewApple(availableNodes: GridNode[]) {
    const { max, spawnChance, rng } = this.#props;
    const willSpawn = this.apples.length < max && rng.randomFlip(spawnChance);

    if (!willSpawn) {
      return;
    }
    const newNode = rng.randomFrom(availableNodes);

    return this.#handleSpawnApple(newNode);
  }

  #handleSpawnApple = (node: GridNode) => {
    const newApple = new Apple(node, { logger: this.#props.logger });
    this.apples.push(newApple);

    return newApple;
  };

  destroyApple(point: string) {
    this.#props.logger.log(`Apple ${point} eaten!`);
    this.apples = [...this.apples].filter(apple => apple.id !== point);
  }
}
