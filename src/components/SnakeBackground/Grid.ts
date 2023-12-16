import { debounce } from "../../util/generics.js";
import { Logger } from "../shared/Logger.js";
import { Rng } from "../shared/Rng.js";
import { Ticker } from "../shared/Ticker.js";
import { ApplesManager } from "./ApplesManager.js";
import { APPLE_COLOUR, BACKGROUND_COLOUR } from "./constants/colours.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";
import type { GridOptions } from "./GridOptions.js";
import { SnakesManager } from "./SnakesManager.js";
import type { GridDimensions, GridNodeStarter } from "./types/grid.js";

interface GridProps extends GridOptions {
  logger?: Logger;
  rng?: Rng;
}

export class Grid {
  readonly #element: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #props: GridProps;

  readonly #squareBase: Path2D;
  readonly #ticker: Ticker;
  readonly #snakes: SnakesManager;
  readonly #apples: ApplesManager;

  #gridNodes: GridNode[] = [];
  #gridNodeProps: GridNodeProps;
  #starterNodes: GridNodeStarter[] = [];

  constructor(element: HTMLCanvasElement, props: GridProps) {
    // todo group this config up (see the config file) and pass directly where its needed
    const {
      gridSpacing,
      rectHeight,
      rectWidth,
      logger = new Logger(),
      rng = new Rng(),
      snakeStartingLength,
      snakeSpawnChance,
      snakeSpeedMs,
      appleSpawnChance,
      maxApples,
      maxSnakes,
    } = props;

    this.#element = element;
    this.#ctx = element.getContext("2d", { alpha: false })!;
    this.#props = props;

    this.#gridNodeProps = {
      rng,
      dimensions: this.#getGridDimensions(),
    };

    this.#ticker = new Ticker({ interval: snakeSpeedMs });
    this.#snakes = new SnakesManager({
      spawnChance: snakeSpawnChance,
      startingLength: snakeStartingLength,
      maxItems: maxSnakes,
      logger,
      rng,
    });
    this.#apples = new ApplesManager({
      spawnChance: appleSpawnChance,
      maxItems: maxApples,
      logger,
      rng,
    });
    const path = new Path2D();
    path.rect(
      gridSpacing,
      gridSpacing,
      rectWidth - gridSpacing,
      rectHeight - gridSpacing,
    );

    this.#squareBase = path;
  }

  init() {
    this.#ticker.addEventListener("tick", this.#handleTick);
    addEventListener("resize", this.#debouncedHandleResize);
    this.#handleResize();
  }

  start() {
    this.#ticker.play();
  }

  togglePause() {
    this.#ticker.toggle();
  }

  #handleTick = () => {
    this.#manageApples();
    this.#manageSnakes();
  };

  #manageSnakes() {
    this.#snakes.maybeAddNewSnake(this.#starterNodes);

    const snakesToRender = this.#snakes.moveSnakes(this.#gridNodeProps);

    Object.entries(snakesToRender).forEach(([color, nodes]) => {
      this.#renderNodes(nodes, color);
    });

    this.#snakes.handleCollisions(this.#starterNodes, this.#apples);
  }

  #manageApples() {
    const availableNodes = this.#gridNodes.filter(gridNode => !gridNode.isWithin(this.#snakes.activeNodes));
    const appleToRender = this.#apples.maybeAddNewApple(availableNodes);

    if (!appleToRender) {
      return;
    }

    this.#renderNodes([appleToRender.node], APPLE_COLOUR);
  }

  #handleResize = () => {
    const { innerHeight, innerWidth } = window;
    this.#element.width = innerWidth;
    this.#element.height = innerHeight;
    // this.#setupGridNodes(innerWidth, innerHeight);

    this.#gridNodeProps = {
      ...this.#gridNodeProps,
      dimensions: this.#getGridDimensions(innerWidth, innerHeight),
    };

    this.#makeGridNodes();
    this.#renderNodes(this.#gridNodes, BACKGROUND_COLOUR);

    this.start();
  };

  #debouncedHandleResize = debounce(this.#handleResize, 500);

  #makeGridNodes() {
    const { rows, cols } = this.#gridNodeProps.dimensions;
    const colArr = new Array(cols).fill(0);
    const rowArr = new Array(rows).fill(0);

    const gridNodes: GridNode[] = [];

    colArr.forEach((_, x) => {
      rowArr.forEach((__, y) => {
        gridNodes.push(new GridNode([x, y], this.#gridNodeProps));
      });
    });

    this.#gridNodes = gridNodes;
    this.#starterNodes = gridNodes.filter(
      (node): node is GridNodeStarter => node.isStarterNode(),
    );
  }

  #getGridDimensions(width: number = window.innerWidth, height: number = window.innerHeight) {
    const { rectHeight, rectWidth } = this.#props;

    const rows = Math.ceil(height / rectHeight);
    const cols = Math.ceil(width / rectWidth);

    const dimensions: GridDimensions = { rows, cols };

    return dimensions;
  }

  #renderNodes(nodes: GridNode[], colour: string) {
    const renderedPath = new Path2D();
    const { rectHeight, rectWidth } = this.#props;

    nodes.forEach((node) => {
      const [x, y] = node.point;
      const offsetMatrix = new DOMMatrix();
      offsetMatrix.e = x * rectWidth;
      offsetMatrix.f = y * rectHeight;

      renderedPath.addPath(this.#squareBase, offsetMatrix);
    });

    requestAnimationFrame(() => {
      this.#ctx.fillStyle = colour;
      this.#ctx.fill(renderedPath);
    });
  }
}
