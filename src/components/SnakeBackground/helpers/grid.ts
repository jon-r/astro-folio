import type { GridPoint } from "../GridNode.js";
import { GridNode } from "../GridNode.js";
import { GRID_DIRECTION_VECTORS, GridDirection, OPPOSITE_EDGES, POSSIBLE_DIRECTIONS } from "./constants.js";
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

export function getNextValidDirection(currentDirection: GridDirection) {
  const possibleDirections = POSSIBLE_DIRECTIONS[currentDirection];
  return biasedRNG(possibleDirections, 1, 50);
}

export function getOppositeStartingPoint(node: GridNode | undefined, targetNodes: GridNode[]) {
  if (!node || node.startDirection === null) {
    throw new Error("collided with a non starter?");
  }

  const { direction, matchingCoordinate } = OPPOSITE_EDGES[node.startDirection];

  return targetNodes.find(targetNode =>
    targetNode.point[matchingCoordinate] === node.point[matchingCoordinate] && targetNode.startDirection === direction
  );
}

export function getOffsetGridPoint(arr1: GridPoint, direction: GridDirection): GridPoint {
  const arr2 = GRID_DIRECTION_VECTORS[direction];
  const [a1, b1] = arr1;
  const [a2, b2] = arr2;

  return [a1 + a2, b1 + b2];
}

export function findNodeCollision(node: GridNode | undefined, targetNodes: GridNode[]) {
  return targetNodes.find(target => target.id === node?.id && node?.owner !== target.owner);
}
