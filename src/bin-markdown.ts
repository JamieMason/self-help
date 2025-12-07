#!/usr/bin/env node

import sade from 'sade';
import { isString } from './lib/utils.js';
import { run } from './markdown.js';

const prog = sade('self-help-markdown', true)
  .describe('generate markdown from a self-help document')
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
