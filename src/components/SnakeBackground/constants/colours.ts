type HexCode = `#${string}`;

export interface SnakeColours {
  body: HexCode;
  head: HexCode;
}

export const APPLE_COLOUR = "#530356";
export const BACKGROUND_COLOUR = "#111";

const snakeColoursGreen: SnakeColours = {
  body: "#141",
  head: "#3A3",
};
const snakeColoursRed: SnakeColours = {
  body: "#411",
  head: "#A33",
};
const snakeColoursBlue: SnakeColours = {
  body: "#114",
  head: "#33A",
};
const snakeColoursYellow: SnakeColours = {
  body: "#443211",
  head: "#ab8133",
};
export const SNAKE_COLOURS: SnakeColours[] = [
  snakeColoursRed,
  snakeColoursGreen,
  snakeColoursBlue,
  snakeColoursYellow,
];
