import fs from 'fs/promises';
import { dirname } from 'path';

export default class File {
  constructor(public path: string) {}

  public read(): Promise<Buffer>;
  public read(encoding: BufferEncoding): Promise<string>;
  public read(encoding?: BufferEncoding) {
    return fs.readFile(this.path, encoding);
  }

  public async write(data: Buffer): Promise<void>;
  public async write(data: string, encoding: BufferEncoding): Promise<void>;
  public async write(data: string | Buffer, encoding?: BufferEncoding) {
    try {
      await fs.writeFile(this.path, data, encoding);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dirname(this.path), { recursive: true });
        await fs.writeFile(this.path, data, encoding);
      } else {
        throw error;
      }
    }
  }

  public remove() {
    return fs.unlink(this.path);
  }
}
