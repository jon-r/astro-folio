import type {GridPoint} from "../components/SnakeBackground/GridNode.js";

export function randomFrom<T>(list: T[]): T {
    const rng = Math.floor(Math.random() * list.length);

    const value = list.at(rng);

    if (value !== undefined) {
        return value;
    }

    return randomFrom(list);
}

export function biasedRNG<T>(
    arr: T[],
    biasedIndex: number,
    biasedMultiplier: number
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

export function addVectors(arr1: GridPoint, arr2: GridPoint): GridPoint {
    const [a1, b1] = arr1;
    const [a2, b2] = arr2;

    return [a1 + a2, b1 + b2];
}