import type { GridNode } from "./GridNode.js";
import { randomFlip, randomFrom } from "./helpers/rng.js";

export interface MaybeSpawnProps {
  spawnChance: number;
  maxItems: number;
}
export abstract class MaybeSpawn<T> {
  readonly #props: MaybeSpawnProps;

  protected constructor(props: MaybeSpawnProps) {
    this.#props = props;
  }
  protected maybeSpawn(currentItems: T[], onSpawn: (target: GridNode) => T, availableNodes: GridNode[]) {
    const shouldSpawn = currentItems.length < this.#props.maxItems && randomFlip(this.#props.spawnChance);
    if (!shouldSpawn) {
      return undefined;
    }

    const initialPosition = randomFrom(availableNodes);

    return onSpawn(initialPosition);
  }
}
