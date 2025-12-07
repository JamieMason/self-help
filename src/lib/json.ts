import { type JsonReadOptions, readJsonSync } from 'fs-extra';
import { resolve } from 'path';

export const readJsonPathSync = (from: string, to: string, options?: JsonReadOptions) =>
  readJsonSync(resolve(from, to), options);
