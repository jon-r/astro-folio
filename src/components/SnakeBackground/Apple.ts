import type { GridNode } from "./GridNode.js";
import type {Logger} from "../shared/Logger.ts";

interface AppleProps {
  logger: Logger;
  id?: string;
}

export class Apple {
  readonly id: string;
  constructor(readonly node: GridNode, props: AppleProps) {
    this.id = props.id || node.id;

    props.logger.log(`Apple spawned at ${node.id}`)
  }
}
