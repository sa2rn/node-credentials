import { tmpdir } from 'os';
import { exec } from 'child_process';
import path from 'path';
import assert from 'assert';
import EncodedFile from './EncodedFile';
import Coder from './Coder';
import File from './File';
import { Command } from './types';

export default class EditCommand implements Command {
  private coder: Coder;

  constructor() {
    this.coder = new Coder(this.getSecretCode());
  }

  public async run(filePath: string) {
    const encodedFile = new EncodedFile(this.coder, filePath);
    const tmpFile = new File(path.join(tmpdir(), path.basename(filePath)));
    await tmpFile.write(await encodedFile.decode());
    await this.editFile(tmpFile);
    await encodedFile.encode(await tmpFile.read());
    await tmpFile.remove();
  }

  private getSecretCode() {
    const { CREDENTIALS_SECRET_KEY } = process.env;
    assert(CREDENTIALS_SECRET_KEY, 'CREDENTIALS_SECRET_KEY environment variable is not set');
    return CREDENTIALS_SECRET_KEY;
  }

  private getEditor() {
    const editor = process.env.EDITOR;
    assert(editor, 'EDITOR environment variable is not set');
    return editor;
  }

  private async editFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`${this.getEditor()} ${file.path}`, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
