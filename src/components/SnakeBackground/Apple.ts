import type { GridNode } from "./GridNode.js";

interface AppleProps {
  node: GridNode;
}
export class Apple {
  readonly #props: AppleProps;

  id: string;

  constructor(props: AppleProps) {
    this.#props = props;
    this.id = props.node.pointStr;
  }

  getApplePosition(): GridNode {
    return this.#props.node;
  }
}
