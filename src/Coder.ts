import {
  createCipheriv, randomBytes, createDecipheriv, CipherKey,
} from 'crypto';

export const IV_LENGTH = 16;
export const KEY_LENGTH = 32;
export const CIPHER_ALGORITHM = 'aes-256-ctr';
export const DEFAULT_ENCODING = 'hex';

export default class Coder {
  constructor(private secretKey: CipherKey) {}

  public async encrypt(data: Buffer): Promise<Buffer>;
  public async encrypt(data: string): Promise<string>;
  public async encrypt(data: Buffer | string) {
    if (typeof data === 'string') {
      const buffer = this.encryptBuffer(Buffer.from(data));
      return buffer.toString(DEFAULT_ENCODING);
    }
    return this.encryptBuffer(data);
  }

  public async decrypt(data: Buffer): Promise<Buffer>;
  public async decrypt(data: string): Promise<string>;
  public async decrypt(data: Buffer | string) {
    if (typeof data === 'string') {
      const buffer = await this.decryptBuffer(Buffer.from(data, DEFAULT_ENCODING));
      return buffer.toString('utf-8');
    }
    return this.decryptBuffer(data);
  }

  private encryptBuffer(data: Buffer) {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(CIPHER_ALGORITHM, this.secretKey, iv);
    return Buffer.concat([iv, cipher.update(data), cipher.final()]);
  }

  private decryptBuffer(data: Buffer) {
    const iv = data.slice(0, IV_LENGTH);
    const decipher = createDecipheriv(CIPHER_ALGORITHM, this.secretKey, iv);
    return Buffer.concat([decipher.update(data.slice(IV_LENGTH)), decipher.final()]);
  }

  public static generateSecretKey() {
    return randomBytes(KEY_LENGTH / 2).toString('hex');
  }
}
