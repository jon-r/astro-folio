import { debounce } from "../../util/generics.js";
import { ApplesManager } from "./ApplesManager.js";
import { APPLE_COLOUR, SnakeColours } from "./constants.js";
import { GridNode, type GridNodeProps } from "./GridNode.js";
import type { GridOptions } from "./GridOptions.js";
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
    console.log("started");

    this.#ticker.play();
  }

  togglePause() {
    console.log('paused');
    this.#ticker.toggle()
  }

  #handleTick = () => {
    this.#manageApples();
    this.#manageSnakes();
  };

  #manageSnakes() {
    this.#snakes.maybeAddNewSnake(this.#starterNodes);

    const rendered = this.#snakes.updateSnakePosition();

    Object.entries(rendered).forEach(([color, nodes]) => {
      this.#renderNodes(nodes, color);
    });

    this.#snakes.handleCollisions(this.#starterNodes, this.#apples);
  }

  #manageApples() {
    const maybeNewApple = this.#apples.maybeAddNewApple(this.#gridNodes, this.#snakes.activeNodes);

    if (!maybeNewApple) {
      return;
    }

    this.#renderNodes([maybeNewApple], APPLE_COLOUR);
  }

  #handleResize = () => {
    const { innerHeight, innerWidth } = window;
    this.#element.width = innerWidth;
    this.#element.height = innerHeight;
    this.#setupGridNodes(innerWidth, innerHeight);

    this.#renderNodes(this.#gridNodes, SnakeColours.Background);

    this.start();
  };

  #debouncedHandleResize = debounce(this.#handleResize, 500);

  #setupGridNodes(width: number, height: number) {
    const { rectHeight, rectWidth } = this.#props;

    const gridNodes: GridNode[] = [];

    const rows = Math.ceil(height / rectHeight);
    const cols = Math.ceil(width / rectWidth);

    const colArr = new Array(cols).fill(0);
    const rowArr = new Array(rows).fill(0);

    const nodeProps: GridNodeProps = { rows, cols };

    colArr.forEach((_, x) => {
      rowArr.forEach((__, y) => {
        gridNodes.push(new GridNode([x, y], nodeProps));
      });
    });

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

// (window as any).TempGrid = Grid;
