#!/usr/bin/env node

import { program } from 'commander';
import { run } from './interactive';
import { isString } from './lib/utils';

program
  .description('navigate a self-help document from the command line')
  .option('-s, --source <path>', 'path to self-help document')
  .parse(process.argv);

const options = program.opts<{ source?: string }>();

if (options.source && isString(options.source)) {
  run({ sourcePath: options.source });
} else {
  program.outputHelp();
  process.exit(1);
}
