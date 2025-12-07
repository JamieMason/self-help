import c from 'tinyrainbow';

export const tryPanic = (fn: (...args: unknown[]) => unknown, message: string): unknown => {
  try {
    return fn();
  } catch (_) {
    console.error(c.red(message));
    process.exit(1);
  }
};

export const tryPanicAsync = async <T>(
  fn: (...args: unknown[]) => T | Promise<T>,
  message: string,
): Promise<T> => {
  try {
    return await fn();
  } catch (_) {
    console.error(c.red(message));
    process.exit(1);
  }
};
