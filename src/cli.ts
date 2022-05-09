import { program } from 'commander';
import EditCommand from './EditCommand';
import KeyCommand from './KeyCommand';

program.command('edit <file>').action(new EditCommand().run);
program.command('key').action(new KeyCommand().run);
program.parse();
