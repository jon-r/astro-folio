const SHOULD_LOG = true;

export class Logger {
  readonly #shouldLog: boolean;

  constructor(shouldLog = SHOULD_LOG) {
    this.#shouldLog = shouldLog;
  }

  log(...message: unknown[]) {
    this.#shouldLog && console.log(...message);
  }

  error(...message: unknown[]) {
    console.log(...message);
  }
}
