import { equal, notEqual, match } from 'assert';
import Coder, { KEY_LENGTH } from './Coder';

describe('Coder', () => {
  let coder: Coder;

  beforeEach(async () => {
    coder = new Coder(Coder.generateSecretKey());
  });

  describe('#encrypt', () => {
    it('should encrypt data', async () => {
      const data = 'Hello, world!';
      const encrypted = await coder.encrypt(data);
      notEqual(encrypted, data);
      match(encrypted, /^[a-f0-9]+$/);
    });
  });

  describe('#decrypt', () => {
    it('should decrypt data', async () => {
      const data = 'Hello, world!';
      const encrypted = await coder.encrypt(data);
      const decrypted = await coder.decrypt(encrypted);
      equal(data, decrypted);
    });
  });

  describe('.generateSecretKey', () => {
    it('should generate a secret key', () => {
      match(Coder.generateSecretKey(), new RegExp(`^[a-f0-9]{${KEY_LENGTH}}$`));
    });
  });
});
