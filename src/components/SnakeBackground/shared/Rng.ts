import { isNotUndefined } from "../util/generics.js";

export class Rng {
  from<T>(list: T[], biasedIndex: number, biasedMultiplier: number): T;
  from<T>(list: T[]): T;
  from<T>(list: T[], biasedIndex?: number, biasedMultiplier?: number) {
    if (biasedIndex && list[biasedIndex]) {
      const biasedArr: T[] = new Array(biasedMultiplier).fill(list[biasedIndex]);
      list.push(...biasedArr);
    }

    const rng = Math.floor(Math.random() * list.length);
    const value = list.at(rng);

    if (isNotUndefined(value)) {
      return value;
    }

    throw new Error("Attempt to get random from nothing");
  }

  flip(chancePercent: number) {
    return (Math.random() * 100) < chancePercent;
  }
}
