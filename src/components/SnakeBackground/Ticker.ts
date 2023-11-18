interface TickerProps {
  interval: number;
  // tickCount: number;
}

export class Ticker extends EventTarget {
  readonly #props: TickerProps;

  #prevTimeStamp = 0;
  #isPaused = true;

  constructor(props: TickerProps) {
    super();

    this.#props = props;
  }

  play() {
    console.log("begin");

    this.#isPaused = false;
    this.#loop(0);
  }

  toggle() {
    if (this.#isPaused) {
      this.play();
    } else {
      this.#isPaused = true;
    }
  }

  #loop = (timestamp: number) => {
    const timeDiff = timestamp - this.#prevTimeStamp;

    if (timeDiff > this.#props.interval) {
      this.#prevTimeStamp = timestamp;
      this.dispatchEvent(new Event("tick"));
    }

    if (!this.#isPaused) {
      requestAnimationFrame(this.#loop);
    }
  };
}
