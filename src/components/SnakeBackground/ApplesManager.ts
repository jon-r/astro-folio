import { Logger } from "../shared/Logger.js";
import { MaybeSpawn, type MaybeSpawnProps } from "../shared/MaybeSpawn.js";
import { Apple } from "./Apple.js";
import type { GridNode } from "./GridNode.js";

interface ApplesManagerProps extends MaybeSpawnProps {
  logger: Logger;
}

export class ApplesManager extends MaybeSpawn<Apple> {
  apples: Apple[] = [];
  #props: ApplesManagerProps;

  constructor(props: ApplesManagerProps) {
    super(props);
    this.#props = props;
  }

  maybeAddNewApple(availableNodes: GridNode[]) {
    return this.maybeSpawn(this.apples, this.#handleSpawnApple, availableNodes)?.node;
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
