const shouldLog = true;

export const debugToConsole = {
  log: (...message: unknown[]) => shouldLog && console.log(...message),
  error: (...message: unknown[]) => console.log(...message),
};
