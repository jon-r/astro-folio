import type { GridNode } from "./GridNode.js";
import { debugToConsole } from "./helpers/logger.js";

export class Apple {
  constructor(readonly node: GridNode, readonly id = node.id) {
    debugToConsole.log(`Apple spawned at ${node.id}`);
  }
}
