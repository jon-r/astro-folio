import type { GridPoint } from "../components/SnakeBackground/GridNode.js";
import { isNotUndefined } from "./generics.js";

// todo optimise this function, does it need to loop?

export function randomFrom<T>(list: T[], allowUndefined: boolean): T | undefined;
export function randomFrom<T>(list: T[]): T;
export function randomFrom<T>(list: T[], allowUndefined?: boolean) {
  const rng = Math.floor(Math.random() * list.length);

  const value = list.at(rng);

  if (isNotUndefined(value)) {
    return value;
  }

  if (allowUndefined) {
    return value;
  }

  throw new Error("Attempt to get random from nothing");
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

export function randomFlip(chancePercent: number) {
  return (Math.random() * 100) < chancePercent;
}

export function addVectors(arr1: GridPoint, arr2: GridPoint): GridPoint {
  const [a1, b1] = arr1;
  const [a2, b2] = arr2;

  return [a1 + a2, b1 + b2];
}
