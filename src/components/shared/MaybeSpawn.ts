import type { GridNode } from "../SnakeBackground/GridNode.js";
import {Rng} from "./Rng.js";

export interface MaybeSpawnProps {
  spawnChance: number;
  maxItems: number;
}

// todo class property rather than abstract
export abstract class MaybeSpawn<T> {
  readonly #props: MaybeSpawnProps;
  #rng = new Rng()

  protected constructor(props: MaybeSpawnProps) {
    this.#props = props;
  }
  protected maybeSpawn<Node extends GridNode>(currentItems: T[], onSpawn: (target: Node) => T, availableNodes: Node[]) {
    const shouldSpawn = currentItems.length < this.#props.maxItems && this.#rng.randomFlip(this.#props.spawnChance);
    if (!shouldSpawn) {
      return undefined;
    }

    const initialPosition = this.#rng.randomFrom(availableNodes);

    return onSpawn(initialPosition);
  }
}
