#!/usr/bin/env node

import { createRequire } from 'module';
import sade from 'sade';
import { run as runInteractive } from './interactive.js';
import { isString } from './lib/utils.js';
import { run as runMarkdown } from './markdown.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const prog = sade('self-help');

prog.version(version);

prog
  .command('interactive')
  .describe('navigate a self-help document from the command line')
  .option('-s, --source', 'path to self-help document')
  .action((opts: { source?: string }) => {
    if (opts.source && isString(opts.source)) {
      runInteractive({ sourcePath: opts.source });
    } else {
      prog.help('interactive');
      process.exit(1);
    }
  });

prog
  .command('markdown')
  .describe('generate markdown from a self-help document')
  .option('-s, --source', 'path to self-help document')
  .action((opts: { source?: string }) => {
    if (opts.source && isString(opts.source)) {
      runMarkdown({ sourcePath: opts.source });
    } else {
      prog.help('markdown');
      process.exit(1);
    }
  });

prog.parse(process.argv);
