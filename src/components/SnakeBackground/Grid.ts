import { debounce } from "../../util/generics.js";
import { Logger } from "../shared/Logger.js";
import { Ticker } from "../shared/Ticker.js";
import { ApplesManager } from "./ApplesManager.js";
import { APPLE_COLOUR, BACKGROUND_COLOUR } from "./constants/colours.js";
import { GridNode } from "./GridNode.js";
import type { GridOptions } from "./GridOptions.js";
import { SnakesManager } from "./SnakesManager.js";
import type { GridDimensions, GridNodeStarter } from "./types/grid.js";

interface GridProps extends GridOptions {
  logger?: Logger;
}

export class Grid {
  readonly #element: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #props: GridProps;

  // todo maybe have all the child classes as part of the constructor props, in the same pattern as nestjs
  readonly #squareBase: Path2D;
  readonly #ticker: Ticker;
  readonly #snakes: SnakesManager;
  readonly #apples: ApplesManager;

  #gridNodes: GridNode[] = [];
  #starterNodes: GridNodeStarter[] = [];

  constructor(element: HTMLCanvasElement, props: GridProps) {
    // todo group this config up (see the config file) and pass directly where its needed
    const {
      gridSpacing,
      rectHeight,
      rectWidth,
      logger = new Logger(),
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

    this.#ticker = new Ticker({ interval: snakeSpeedMs });
    this.#snakes = new SnakesManager({
      spawnChance: snakeSpawnChance,
      startingLength: snakeStartingLength,
      maxItems: maxSnakes,
      logger,
    });
    this.#apples = new ApplesManager({
      spawnChance: appleSpawnChance,
      maxItems: maxApples,
      logger,
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

  // todo think resize needs to reset snake count?
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

    // todo better name?
    const snakesToRender = this.#snakes.updateSnakePosition();

    Object.entries(snakesToRender).forEach(([color, nodes]) => {
      this.#renderNodes(nodes, color);
    });

    this.#snakes.handleCollisions(this.#starterNodes, this.#apples);
  }

  // todo does this filter apples from state?
  #manageApples() {
    const availableNodes = this.#gridNodes.filter(gridNode => !gridNode.isWithin(this.#snakes.activeNodes));
    const appleToRender = this.#apples.maybeAddNewApple(availableNodes);

    if (!appleToRender) {
      return;
    }

    this.#renderNodes([appleToRender], APPLE_COLOUR);
  }

  #handleResize = () => {
    const { innerHeight, innerWidth } = window;
    this.#element.width = innerWidth;
    this.#element.height = innerHeight;
    this.#setupGridNodes(innerWidth, innerHeight);

    this.#renderNodes(this.#gridNodes, BACKGROUND_COLOUR);

    this.start();
  };

  #debouncedHandleResize = debounce(this.#handleResize, 500);

  #makeGridNodes(nodeProps: GridDimensions) {
    const { rows, cols } = nodeProps;
    const colArr = new Array(cols).fill(0);
    const rowArr = new Array(rows).fill(0);

    const gridNodes: GridNode[] = [];

    colArr.forEach((_, x) => {
      rowArr.forEach((__, y) => {
        gridNodes.push(new GridNode([x, y], nodeProps));
      });
    });

    this.#gridNodes = gridNodes;
    this.#starterNodes = gridNodes.filter(
      (node): node is GridNodeStarter => node.isStarterNode(),
    );
  }

  #setupGridNodes(width: number, height: number) {
    const { rectHeight, rectWidth } = this.#props;

    const rows = Math.ceil(height / rectHeight);
    const cols = Math.ceil(width / rectWidth);

    const nodeProps: GridDimensions = { rows, cols };

    this.#makeGridNodes(nodeProps);

    // todo can similar be done for apples? is it needed if just pass on 'move'?
    this.#snakes.setGridDimensions(nodeProps);
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
