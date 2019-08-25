import { resolve } from 'path';
import { selfHelp } from '.';
import { createTreeInterpreter } from './machine/tree';

export const run = async ({ sourcePath }: { sourcePath: string }) => {
  const dataPath = resolve(process.cwd(), sourcePath);
  const source = require(dataPath);
  const tree = await source.getData();
  const interpreter = createTreeInterpreter(tree);
  selfHelp(interpreter);
};
