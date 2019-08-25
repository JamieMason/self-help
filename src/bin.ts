#!/usr/bin/env node

import * as program from 'commander';

program
  .version(require('../package.json').version)
  .command('interactive', 'navigate a self-help document from the command line')
  .parse(process.argv);
