import { randomFlip } from "../../util/number.js";

export interface MaybeSpawnProps {
  spawnChance: number;
  maxItems: number;
}
export abstract class MaybeSpawn {
  readonly #props: MaybeSpawnProps;

  protected constructor(props: MaybeSpawnProps) {
    this.#props = props;
  }
  protected maybeSpawn<T>(currentItems: T[]): boolean {
    return currentItems.length < this.#props.maxItems && randomFlip(this.#props.spawnChance);
  }
}
