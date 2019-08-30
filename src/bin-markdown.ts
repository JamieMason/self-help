#!/usr/bin/env node

import * as program from 'commander';
import { isString } from 'lodash';
import { run } from './markdown';

program
  .description('generate markdown from a self-help document')
  .option('-s, --source <path>', 'path to self-help document')
  .parse(process.argv);

if (program.source && isString(program.source)) {
  run({ sourcePath: program.source });
} else {
  program.outputHelp();
  process.exit(1);
}
