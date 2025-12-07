import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface JsonReadOptions {
  encoding?: BufferEncoding;
  reviver?: (key: string, value: unknown) => unknown;
}

export const readJsonPathSync = (from: string, to: string, options?: JsonReadOptions): unknown => {
  const filePath = resolve(from, to);
  const content = readFileSync(filePath, {
    encoding: options?.encoding ?? 'utf-8',
  });
  return JSON.parse(content, options?.reviver);
};
