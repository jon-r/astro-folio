interface LoggerProps {
  shouldLog: boolean;
}

export class Logger {
  #props: LoggerProps;

  constructor(props: LoggerProps) {
    this.#props = props;
  }

  log(...message: unknown[]) {
    this.#props.shouldLog && console.log(...message);
  }

  error(...message: unknown[]) {
    console.log(...message);
  }
}
