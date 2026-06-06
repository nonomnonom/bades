/* oxlint-disable no-console */
export class ConsoleListener {
  private readonly originalConsole;

  constructor() {
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    };
  }

  // oxlint-disable-next-line @typescripttypescript/no-explicit-any
  intercept(callback: (type: string, message: unknown[]) => void) {
    Object.keys(this.originalConsole).forEach((method) => {
      (console as unknown as Record<string, unknown>)[method] = (
        ...args: unknown[]
      ) => {
        callback(method, args);
      };
    });
  }

  release() {
    Object.keys(this.originalConsole).forEach((method) => {
      (console as unknown as Record<string, unknown>)[method] = (
        ...args: unknown[]
      ) => {
        (this.originalConsole as Record<string, (...a: unknown[]) => void>)[
          method
        ](...args);
      };
    });
  }
}
