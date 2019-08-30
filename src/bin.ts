#!/usr/bin/env node

import * as program from 'commander';

program
  .version(require('../package.json').version)
  .command('interactive', 'navigate a self-help document from the command line')
  .command('markdown', 'generate markdown from a self-help document')
  .parse(process.argv);
