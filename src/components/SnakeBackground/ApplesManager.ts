import { randomFrom } from "../../util/number.js";
import { Apple } from "./Apple.js";
import type { GridNode } from "./GridNode.js";
import { MaybeSpawn, type MaybeSpawnProps } from "./MaybeSpawn.js";

interface ApplesManagerProps extends MaybeSpawnProps {
  // spawnChance: number;
}

export class ApplesManager extends MaybeSpawn {
  // #props: ApplesManagerProps;

  apples: Apple[] = [];

  constructor(props: ApplesManagerProps) {
    super(props);

    // this.#props = props;
  }
  maybeAddNewApple(allNodes: GridNode[], usedNodes: GridNode[]) {
    if (!this.maybeSpawn(this.apples)) {
      return;
    }

    const newApplePosition = randomFrom(allNodes);

    if (usedNodes.some(node => node.pointStr === newApplePosition.pointStr)) {
      return null;
    }

    const newApple = new Apple({ node: newApplePosition });

    this.apples.push(newApple);

    return newApple.getApplePosition();
  }

  destroyApple(point: string) {
    console.log(`Apple ${point} eaten!`);
    this.apples = [...this.apples].filter(apple => apple.id !== point);
  }
}
