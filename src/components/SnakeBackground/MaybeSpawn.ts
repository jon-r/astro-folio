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
  protected maybeSpawn(currentCount: number): boolean {
    return currentCount < this.#props.maxItems && randomFlip(this.#props.spawnChance);
  }
}
