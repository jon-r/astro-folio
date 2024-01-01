interface Callback {
  (...args: unknown[]): void;
}

interface DebouncedCallback extends Callback {
  cancel?: () => void;
}

interface DebounceOptions {
  leading?: boolean;
}

// https://youmightnotneed.com/lodash/
export function debounce(
  func: Callback,
  delay: number,
  { leading }: DebounceOptions = {},
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

export function isNotUndefined<T>(item: T | undefined): item is T {
  return typeof item !== "undefined";
}

export function isFactorOf(target: number) {
  return (value: number) => value && !(value % target);
}
