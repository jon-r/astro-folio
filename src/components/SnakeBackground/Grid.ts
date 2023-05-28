import { debounce } from "../../util/generics.js";
import { GridNode, GridNodeProps } from "./GridNode.js";
import type { GridOptions } from "./GridOptions.js";
import {SnakeColours} from "./constants.js";
import { Ticker } from "./Ticker.js";
import { Snake } from "./Snake.js";
import {randomFrom} from "../../util/number.js";

type GridProps = GridOptions;

export class Grid {
  readonly #element: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #props: GridProps;
  readonly #squareBase: Path2D;
  readonly #ticker: Ticker;

  #nodeProps: GridNodeProps = { rows: 0, cols: 0 };
  #gridNodes: GridNode[] = [];
  #starterNodes: GridNode[] = [];
  #snakes: Snake[] = [];
  #nextSnakeId: number = 0;

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
    
    this.#ticker.play();
  }

  #handleTick = () => {
    if (this.#snakes.length < this.#props.maxSnakes) {
      this.#addNewSnake();
    }

    this.#controlSnakes();
  };

  #addNewSnake() {
    this.#nextSnakeId = (this.#nextSnakeId + 1) % this.#props.maxSnakes;

    this.#snakes.push(
      new Snake({
        startingNode: randomFrom(this.#starterNodes),
        startingLength: this.#props.snakeStartingLength,
        id: String(this.#nextSnakeId),
      })
    );
  }

  #controlSnakes() {
    const rendered: Record<SnakeColours, GridNode[]> = {
      [SnakeColours.Background]: [],
      [SnakeColours.Head]: [],
      [SnakeColours.Body]: [],
      [SnakeColours.Tail]: [],
    };
    const activeNodes: GridNode[] = [];

    this.#snakes.forEach((snake) => {
      snake.moveSnake(this.#nodeProps);
      
      const snakeParts = snake.getSnakeAsParts();
      
      if (snakeParts.head) {
        rendered[SnakeColours.Background].push(snakeParts.head);
      }
      
      rendered[SnakeColours.Background].push(...snakeParts.end);
      rendered[SnakeColours.Body].push(...snakeParts.body);
      rendered[SnakeColours.Tail].push(...snakeParts.tail);
      activeNodes.push(...snakeParts.body, ...snakeParts.tail);
    });

    Object.entries(rendered).forEach(([color, nodes]) => {
      this.#renderNodes(nodes, color)
    });

    this.#snakes.forEach(snake => {
      // todo have it go off the opposite side if it hits a wall
      snake.handleCollisions([...activeNodes, ...this.#starterNodes]);
    })

    this.#snakes = [...this.#snakes].filter(snake => !snake.isDead);
  }

  #handleResize = () => {
    const { innerHeight, innerWidth } = window;
    this.#element.width = innerWidth;
    this.#element.height = innerHeight;
    this.#setupGridNodes(innerWidth, innerHeight);

    this.#renderNodes(
      this.#gridNodes.filter((n) => n.startDirection === null),
      SnakeColours.Background
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
    this.#starterNodes =  gridNodes.filter((node) => node.startDirection !== null)
    this.#nodeProps = nodeOptions;
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

(window as any).TempGrid = Grid;
