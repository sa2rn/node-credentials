import Coder from './Coder';
import File from './File';

export default class EncodedFile extends File {
  constructor(private coder: Coder, public path: string) {
    super(path);
  }

  public async decode() {
    try {
      const encodedData = await this.read();
      const decodedData = await this.coder.decrypt(encodedData);
      return decodedData;
    } catch (error: any) {
      if (error.code === 'ENOENT') return Buffer.alloc(0);
      throw error;
    }
  }

  public async encode(data: Buffer) {
    const encodedData = await this.coder.encrypt(data);
    await this.write(encodedData);
  }
}
