import { readJsonSync, ReadOptions } from 'fs-extra';
import { resolve } from 'path';

export const readJsonPathSync = (from: string, to: string, options?: ReadOptions) =>
  readJsonSync(resolve(from, to), options);
