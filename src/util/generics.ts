interface Callback {
  (...args: unknown[]): void;
}

interface DebouncedCallback extends Callback {
  cancel?: () => void;
}

export interface DebounceOptions {
  leading?: boolean;
}

// https://youmightnotneed.com/lodash/
export function debounce(
  func: Callback,
  delay: number,
  { leading }: DebounceOptions = {}
): DebouncedCallback {
  let timerId: NodeJS.Timeout;

  const debounced = (...args: unknown[]) => {
    if (!timerId && leading) {
      func(...args);
    }

    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timerId);

  return debounced;
}

export function randomFrom<T>(list: T[]): T {
  const rng = Math.floor(Math.random() * list.length);

  return list.at(rng) || randomFrom(list);
}

export function biasedRNG<T>(
  arr: T[],
  biasedIndex: number,
  biasedMultiplier: number
): T {
  const biasedArr = [...arr];
  const boosted = arr[biasedIndex];

  let n = 0;
  while (n < biasedMultiplier && boosted) {
    biasedArr.push(boosted);
    n += 1;
  }

  return randomFrom(biasedArr);
}
