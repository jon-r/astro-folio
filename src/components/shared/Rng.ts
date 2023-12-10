export class Rng {
    randomFrom<T>(list: T[], biasedIndex: number, biasedMultiplier: number): T
    randomFrom<T>(list: T[]): T
    randomFrom<T>(list: T[], biasedIndex?: number, biasedMultiplier?: number) {
        if (biasedIndex && list[biasedIndex]) {
            const biasedArr: T[] = new Array(biasedMultiplier).fill(list[biasedIndex]);
            list.push(...biasedArr);
        }

        const rng = Math.floor(Math.random() * list.length);
        const value = list.at(rng);

        if (!value) {
            throw new Error("Attempt to get random from nothing");
        }

        return value;
    }

    randomFlip(chancePercent: number) {
        return (Math.random() * 100) < chancePercent;
    }
}