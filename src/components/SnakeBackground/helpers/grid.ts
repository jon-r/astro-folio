import type { GridPoint } from "../GridNode.js";
import { GridNode } from "../GridNode.js";
import { GridDirection } from "./constants.js";
import { biasedRNG } from "./rng.js";

export function makeGridPoints(rows: number, cols: number) {
  const colArr = new Array(cols).fill(0);
  const rowArr = new Array(rows).fill(0);

  const gridPoints: GridPoint[] = [];

  colArr.forEach((_, x) => {
    rowArr.forEach((__, y) => {
      gridPoints.push([x, y]);
    });
  });

  return gridPoints;
}

const possibleDirectionsList: Record<
  GridDirection,
  [GridDirection, GridDirection, GridDirection]
> = {
  [GridDirection.Up]: [
    GridDirection.Left,
    GridDirection.Up,
    GridDirection.Right,
  ],
  [GridDirection.Right]: [
    GridDirection.Up,
    GridDirection.Right,
    GridDirection.Down,
  ],
  [GridDirection.Down]: [
    GridDirection.Right,
    GridDirection.Down,
    GridDirection.Left,
  ],
  [GridDirection.Left]: [
    GridDirection.Down,
    GridDirection.Left,
    GridDirection.Up,
  ],
};

export function getNextValidDirection(currentDirection: GridDirection) {
  const possibleDirections = possibleDirectionsList[currentDirection];
  return biasedRNG(possibleDirections, 1, 50);
}

export function addVectors(arr1: GridPoint, arr2: GridPoint): GridPoint {
  const [a1, b1] = arr1;
  const [a2, b2] = arr2;

  return [a1 + a2, b1 + b2];
}

export function findNodeCollision(node: GridNode | undefined, targetNodes: GridNode[]) {
  return targetNodes.find(target => target.id === node?.id && node?.owner !== target.owner);
}
