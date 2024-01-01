import { Apple } from "./Apple.js";
import type { GridNode } from "./GridNode.js";
import { Logger } from "./shared/Logger.js";
import type { Rng } from "./shared/Rng.js";
import type { ApplesOptions } from "./types/config.js";

interface ApplesManagerProps extends ApplesOptions {
  logger: Logger;
  rng: Rng;
}

export class ApplesManager {
  readonly #props: ApplesManagerProps;

  apples: Apple[] = [];

  constructor(props: ApplesManagerProps) {
    this.#props = props;
  }

  add(availableNodes: GridNode[]) {
    const { max, spawnChance, rng } = this.#props;
    const willSpawn = this.apples.length < max && rng.flip(spawnChance);

    if (!willSpawn) {
      return;
    }
    const newNode = rng.from(availableNodes);

    return this.#handleSpawnApple(newNode);
  }

  #handleSpawnApple = (node: GridNode) => {
    const newApple = new Apple(node, { logger: this.#props.logger });
    this.apples.push(newApple);

    return newApple;
  };

  remove(point: string) {
    this.#props.logger.log(`Apple ${point} eaten!`);
    this.apples = [...this.apples].filter(apple => apple.id !== point);
  }
}
