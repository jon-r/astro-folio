import { debounce, randomFrom } from "../../util/generics.js";
import { GridNode, GridNodeProps } from "./GridNode.js";
import type { GridOptions } from "./GridOptions.js";
import { GridColours, GridDirection } from "./constants.js";
import { Ticker } from "./Ticker.js";
import { Snake } from "./Snake.js";

type GridProps = GridOptions;

export class Grid {
  readonly #element: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #props: GridProps;
  readonly #squareBase: Path2D;
  readonly #ticker: Ticker;

  #nodeProps: GridNodeProps = { rows: 0, cols: 0 };
  #gridNodes: GridNode[] = [];
  #snakes: Snake[] = [];

  constructor(element: HTMLCanvasElement, props: GridProps) {
    const { gridSpacing, rectHeight, rectWidth } = props;

    this.#element = element;
    this.#ctx = element.getContext("2d", { alpha: false })!;
    this.#props = props;
    this.#ticker = new Ticker({ interval: props.snakeSpeedMs });

    const path = new Path2D();
    path.rect(
      gridSpacing,
      gridSpacing,
      rectWidth - gridSpacing,
      rectHeight - gridSpacing
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
    const startPoints = this.#gridNodes.filter((node) => node.startDirection);
    this.#ticker.play();
  }

  #handleTick = () => {
    if (this.#snakes.length < this.#props.maxSnakes) {
      this.#addNewSnake();
    }

    this.#controlSnakes();
  };

  #addNewSnake() {
    const startingNodes = this.#gridNodes.filter((node) => node.startDirection);

    this.#snakes.push(
      new Snake({
        startingNode: randomFrom(startingNodes),
        startingLength: this.#props.snakeStartingLength,
      })
    );
  }

  #controlSnakes() {
    // todo fix types. use enum/record for color
    const rendered = {
      [GridColours.Head]: [] as GridNode[],
      [GridColours.Body]: [] as GridNode[],
      [GridColours.Tail]: [] as GridNode[],
      [GridColours.Background]: [] as GridNode[],
    };

    this.#snakes.forEach((snake) => {
      snake.moveSnake(this.#nodeProps);

      const snakeParts = snake.getSnakeParts();

      rendered[GridColours.Head].push(snakeParts.head);
      rendered[GridColours.Body].push(...snakeParts.body);
      // rendered[GridColours.Tail].push(...snakeParts.tail);
      // rendered[GridColours.Background].push(...snakeParts.gone);
    });

    Object.entries(rendered).forEach(([colour, nodes]) =>
      this.#renderNodes(nodes, colour as GridColours)
    );
  }

  #handleResize = () => {
    const { innerHeight, innerWidth } = window;
    this.#element.width = innerWidth;
    this.#element.height = innerHeight;
    this.#setupGridNodes(innerWidth, innerHeight);

    // temp
    this.#renderNodes(
      this.#gridNodes.filter((n) => n.startDirection === null),
      GridColours.Background
    );
    this.#renderNodes(
      this.#gridNodes.filter((n) => n.startDirection === GridDirection.Up),
      GridColours.Up
    );
    this.#renderNodes(
      this.#gridNodes.filter((n) => n.startDirection === GridDirection.Right),
      GridColours.Right
    );
    this.#renderNodes(
      this.#gridNodes.filter((n) => n.startDirection === GridDirection.Down),
      GridColours.Down
    );
    this.#renderNodes(
      this.#gridNodes.filter((n) => n.startDirection === GridDirection.Left),
      GridColours.Left
    );

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

    const nodeOptions: GridNodeProps = {
      rows,
      cols,
    };

    colArr.forEach((_, x) => {
      rowArr.forEach((__, y) => {
        gridNodes.push(new GridNode([x, y], nodeOptions));
      });
    });

    this.#gridNodes = gridNodes;
    this.#nodeProps = nodeOptions;
  }

  #renderNodes(nodes: GridNode[], colour: GridColours) {
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

(window as any).TempGrid = Grid;
