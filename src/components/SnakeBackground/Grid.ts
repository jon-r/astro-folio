import { debounce } from "../../util/generics.js";
import { ApplesManager } from "./ApplesManager.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";
import type { GridOptions } from "./GridOptions.js";
import {APPLE_COLOUR, BACKGROUND_COLOUR} from "./helpers/constants.js";
import { findNodeCollision, makeGridPoints } from "./helpers/grid.js";
import { SnakesManager } from "./SnakesManager.js";
import { Ticker } from "./Ticker.js";

type GridProps = GridOptions;

export class Grid {
  readonly #element: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #props: GridProps;

  readonly #squareBase: Path2D;
  readonly #ticker: Ticker;
  readonly #snakes: SnakesManager;
  readonly #apples: ApplesManager;

  #gridNodes: GridNode[] = [];
  #starterNodes: GridNode[] = [];

  constructor(element: HTMLCanvasElement, props: GridProps) {
    const { gridSpacing, rectHeight, rectWidth } = props;

    this.#element = element;
    this.#ctx = element.getContext("2d", { alpha: false })!;
    this.#props = props;

    this.#ticker = new Ticker({ interval: props.snakeSpeedMs });
    this.#snakes = new SnakesManager({
      spawnChance: props.snakeSpawnChance,
      snakeStartingLength: props.snakeStartingLength,
      maxItems: props.maxSnakes,
    });
    this.#apples = new ApplesManager({
      spawnChance: props.appleSpawnChance,
      maxItems: props.maxApples,
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

    const snakesToRender = this.#snakes.updateSnakePosition();

    Object.entries(snakesToRender).forEach(([color, nodes]) => {
      this.#renderNodes(nodes, color);
    });

    this.#snakes.handleCollisions(this.#starterNodes, this.#apples);
  }

  #manageApples() {
    const availableNodes = this.#gridNodes.filter(gridNode => !findNodeCollision(gridNode, this.#snakes.activeNodes));
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

  #setupGridNodes(width: number, height: number) {
    const { rectHeight, rectWidth } = this.#props;

    const rows = Math.ceil(height / rectHeight);
    const cols = Math.ceil(width / rectWidth);

    const nodeProps: GridNodeProps = { rows, cols };

    const gridNodes: GridNode[] = makeGridPoints(rows, cols).map((gridPoint) => new GridNode(gridPoint, nodeProps));

    this.#gridNodes = gridNodes;
    this.#starterNodes = gridNodes.filter(
      (node) => node.startDirection !== null,
    );

    this.#snakes.setNodeProps(nodeProps);
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
