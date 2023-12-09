const shouldLog = true;

// todo prod compiler to empty string?
export const debugToConsole = {
  log: (...message: unknown[]) => shouldLog && console.log(...message),
  error: (...message: unknown[]) => console.log(...message),
};
