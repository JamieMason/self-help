import * as chalk from 'chalk';

export const tryPanic = (fn: (...args: any[]) => any, message: string) => {
  try {
    return fn();
  } catch (err) {
    console.error(chalk.red(message));
    process.exit(1);
  }
};
