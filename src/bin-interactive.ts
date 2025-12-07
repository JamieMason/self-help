#!/usr/bin/env node

import sade from 'sade';
import { run } from './interactive';
import { isString } from './lib/utils';

const prog = sade('self-help-interactive', true)
  .describe('navigate a self-help document from the command line')
  .option('-s, --source', 'path to self-help document')
  .action((opts: { source?: string }) => {
    if (opts.source && isString(opts.source)) {
      run({ sourcePath: opts.source });
    } else {
      prog.help();
      process.exit(1);
    }
  });

prog.parse(process.argv);
