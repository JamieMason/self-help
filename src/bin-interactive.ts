import * as program from 'commander';
import { isString } from 'lodash';
import { run } from './interactive';

program
  .description('navigate a self-help document from the command line')
  .option('-s, --source <path>', 'path to self-help document')
  .parse(process.argv);

if (program.source && isString(program.source)) {
  run({ sourcePath: program.source });
} else {
  program.outputHelp();
  process.exit(1);
}
