import { ApplesManager } from "./ApplesManager.js";
import { APPLE_COLOUR, GRID_COLOUR } from "./constants/colours.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";
import { Logger } from "./shared/Logger.js";
import { Rng } from "./shared/Rng.js";
import { Ticker } from "./shared/Ticker.js";
import { SnakesManager } from "./SnakesManager.js";
import type { GridConfig } from "./types/config.js";
import type { GridDimensions, GridNodeStarter } from "./types/grid.js";
import { debounce, isFactorOf } from "./util/generics.js";

interface GridProps {
  config: GridConfig;
}

export class Grid {
  readonly #canvasElement: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #props: GridProps;

  readonly #squareBase: Path2D;
  readonly #ticker: Ticker;
  readonly #snakes: SnakesManager;
  readonly #apples: ApplesManager;

  #gridNodes: GridNode[] = [];
  #gridNodeProps: GridNodeProps;
  #starterNodes: GridNodeStarter[] = [];

  constructor(canvasElement: HTMLCanvasElement, props: GridProps) {
    const { config } = props;

    this.#canvasElement = canvasElement;
    // this.#canvasElement.style.backgroundColor = 'red'
    this.#ctx = canvasElement.getContext("2d", { alpha: true })!;
    this.#props = props;

    const rng = new Rng();
    const logger = new Logger(config.debug);

    this.#gridNodeProps = {
      ...config.grid,
      dimensions: this.#getGridDimensions(),
      rng,
    };

    this.#ticker = new Ticker({ interval: config.snakes.speedMs });

    this.#snakes = new SnakesManager({
      ...config.snakes,
      logger,
      rng,
    });

    this.#apples = new ApplesManager({
      ...config.apples,
      logger,
      rng,
    });

    const path = new Path2D();
    path.rect(
      0,
      0,
      config.grid.size,
      config.grid.size,
    );

    this.#squareBase = path;
  }

  init(autoplay = true) {
    this.#ticker.addEventListener("tick", this.#handleTick);
    addEventListener("resize", this.#debouncedHandleResize);
    this.#handleResize();
    // this.#renderPauseButton();
    if (autoplay) {
      this.#start();
    }
  }

  #start() {
    this.#ticker.play();
  }

  #togglePause() {
    this.#ticker.toggle();
  }

  #handleTick = () => {
    this.#manageApples();
    this.#manageSnakes();
  };

  // @ts-expect-error - disabled
  #renderPauseButton = () => {
    const pauseButton = document.createElement("button");
    pauseButton.addEventListener("click", () => this.#togglePause());
    pauseButton.innerText = "Pause Snakes";
    pauseButton.setAttribute("type", "button");

    pauseButton.classList.add("absolute", "top-4", "right-4");
    document.body.appendChild(pauseButton);
  };

  #manageSnakes() {
    this.#snakes.add(this.#starterNodes);

    const snakesToRender = this.#snakes.move(this.#gridNodeProps);

    Object.entries(snakesToRender).forEach(([color, nodes]) => {
      this.#renderNodes(nodes, color);
    });

    this.#snakes.handleCollisions(this.#starterNodes, this.#apples);
  }

  #manageApples() {
    const availableNodes = this.#gridNodes
      .filter(gridNode => gridNode.isCrossPoint && !gridNode.isWithin(this.#snakes.activeNodes));
    const appleToRender = this.#apples.add(availableNodes);

    if (!appleToRender) {
      return;
    }

    this.#renderNodes([appleToRender.node], APPLE_COLOUR);
  }

  #handleResize = () => {
    const { innerHeight, innerWidth } = window;
    this.#canvasElement.width = innerWidth;
    this.#canvasElement.height = innerHeight;

    this.#gridNodeProps = {
      ...this.#gridNodeProps,
      dimensions: this.#getGridDimensions(innerWidth, innerHeight),
    };

    this.#makeGridNodes();
    this.#renderNodes(this.#gridNodes, GRID_COLOUR);
  };

  #debouncedHandleResize = debounce(this.#handleResize, 500);

  #makeGridNodes() {
    const { spacing } = this.#props.config.grid;
    const { rows, cols } = this.#gridNodeProps.dimensions;
    const colArr = new Array(cols).fill(0);
    const rowArr = new Array(rows).fill(0);
    const isFactor = isFactorOf(spacing);

    const gridNodes: GridNode[] = [];

    colArr.forEach((_, x) => {
      rowArr.forEach((__, y) => {
        if (isFactor(y) || isFactor(x)) {
          gridNodes.push(new GridNode([x, y], this.#gridNodeProps));
        }
      });
    });

    this.#gridNodes = gridNodes;
    this.#starterNodes = gridNodes.filter(
      (node): node is GridNodeStarter => node.isStarterNode(),
    );
  }

  #getGridDimensions(width: number = window.innerWidth, height: number = window.innerHeight) {
    const { size } = this.#props.config.grid;

    const rows = Math.ceil(height / size);
    const cols = Math.ceil(width / size);

    const dimensions: GridDimensions = { rows, cols };

    return dimensions;
  }

  #renderNodes(nodes: GridNode[], colour: string) {
    const renderedPath = new Path2D();
    const { size } = this.#props.config.grid;

    nodes.forEach((node) => {
      const [x, y] = node.point;
      const offsetMatrix = new DOMMatrix();
      offsetMatrix.e = x * size;
      offsetMatrix.f = y * size;

      renderedPath.addPath(this.#squareBase, offsetMatrix);
    });

    requestAnimationFrame(() => {
      this.#ctx.fillStyle = colour;
      this.#ctx.fill(renderedPath);
    });
  }
}
