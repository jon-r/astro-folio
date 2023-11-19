import { Apple } from "./Apple.js";
import type { GridNode } from "./GridNode.js";
import { debugToConsole } from "./helpers/logger.js";
import { MaybeSpawn, type MaybeSpawnProps } from "./MaybeSpawn.js";

interface ApplesManagerProps extends MaybeSpawnProps {}

export class ApplesManager extends MaybeSpawn<Apple> {
  apples: Apple[] = [];

  constructor(props: ApplesManagerProps) {
    super(props);
  }

  maybeAddNewApple(availableNodes: GridNode[]) {
    return this.maybeSpawn(this.apples, this.#handleSpawnApple, availableNodes)?.node;
  }

  #handleSpawnApple = (node: GridNode) => {
    const newApple = new Apple(node);
    this.apples.push(newApple);

    return newApple;
  };

  destroyApple(point: string) {
    debugToConsole.log(`Apple ${point} eaten!`);
    this.apples = [...this.apples].filter(apple => apple.id !== point);
  }
}
