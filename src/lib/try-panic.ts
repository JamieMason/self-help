import chalk from 'chalk';

export const tryPanic = (fn: (...args: unknown[]) => unknown, message: string) => {
  try {
    return fn();
  } catch (_) {
    console.error(chalk.red(message));
    process.exit(1);
  }
};
