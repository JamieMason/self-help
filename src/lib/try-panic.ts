import c from 'tinyrainbow';

export const tryPanic = (fn: (...args: unknown[]) => unknown, message: string) => {
  try {
    return fn();
  } catch (_) {
    console.error(c.red(message));
    process.exit(1);
  }
};
