import Coder from './Coder';
import { Command } from './types';

export default class KeyCommand implements Command {
  public run(): void {
    process.stdout.write(Coder.generateSecretKey());
  }
}
