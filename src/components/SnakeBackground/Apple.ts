import type { Logger } from "./shared/Logger.js";
import type { GridNode } from "./GridNode.js";

interface AppleProps {
  logger: Logger;
}

export class Apple {
  readonly id: string;

  constructor(readonly node: GridNode, props: AppleProps) {
    this.id = node.id;

    props.logger.log(`Apple spawned at ${node.id}`);
  }
}
