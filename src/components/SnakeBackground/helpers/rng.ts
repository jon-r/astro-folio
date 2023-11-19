import { isNotUndefined } from "../../../util/generics.js";

export function randomFrom<T>(list: T[]): T {
  const rng = Math.floor(Math.random() * list.length);

  const value = list.at(rng);

  if (isNotUndefined(value)) {
    return value;
  }

  throw new Error("Attempt to get random from nothing");
}

export function randomFlip(chancePercent: number) {
  return (Math.random() * 100) < chancePercent;
}

export function biasedRNG<T>(
  arr: T[],
  biasedIndex: number,
  biasedMultiplier: number,
): T {
  const biasedArr = [...arr];
  const boosted = arr[biasedIndex] ?? null;

  let n = 0;
  while (n < biasedMultiplier && boosted !== null) {
    biasedArr.push(boosted);
    n += 1;
  }

  return randomFrom(biasedArr);
}

export function loopIds(prev: number, limit: number) {
  return (prev + 1) % (limit * 2);
}
