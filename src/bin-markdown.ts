#!/usr/bin/env node

import { program } from 'commander';
import { isString } from './lib/utils';
import { run } from './markdown';

program
  .description('generate markdown from a self-help document')
  .option('-s, --source <path>', 'path to self-help document')
  .parse(process.argv);

const options = program.opts<{ source?: string }>();

if (options.source && isString(options.source)) {
  run({ sourcePath: options.source });
} else {
  program.outputHelp();
  process.exit(1);
}
