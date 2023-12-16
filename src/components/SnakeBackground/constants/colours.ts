export type HexCode = `#${string}`;

export interface SnakeColours {
  body: HexCode;
  head: HexCode;
}

export const APPLE_COLOUR = "#530356";
export const BACKGROUND_COLOUR = "#111";

const snakeColours1: SnakeColours = {
  body: "#441111",
  head: "#aa3333",
};
const snakeColours2: SnakeColours = {
  body: "#453011",
  head: "#ab7b33",
};
const snakeColours3: SnakeColours = {
  body: "#454511",
  head: "#abab33",
};
const snakeColours4: SnakeColours = {
  body: "#2b4511",
  head: "#6fab33",
};
const snakeColours5: SnakeColours = {
  body: "#114511",
  head: "#33ab33",
};
const snakeColours6: SnakeColours = {
  body: "#114545",
  head: "#33abab",
};
const snakeColours7: SnakeColours = {
  body: "#112b45",
  head: "#336fab",
};
const snakeColours8: SnakeColours = {
  body: "#111145",
  head: "#3333ab",
};
const snakeColours9: SnakeColours = {
  body: "#2b1145",
  head: "#6f33ab",
};
const snakeColours10: SnakeColours = {
  body: "#451145",
  head: "#ab33ab",
};
const snakeColours11: SnakeColours = {
  body: "#45112b",
  head: "#ab336f",
};

export const SNAKE_COLOURS: SnakeColours[] = [
  snakeColours1,
  snakeColours2,
  snakeColours3,
  snakeColours4,
  snakeColours5,
  snakeColours6,
  snakeColours7,
  snakeColours8,
  snakeColours9,
  snakeColours10,
  snakeColours11,
];
