import { equal, notEqual } from 'assert';
import fs from 'fs/promises';
import { stub, SinonStubbedInstance } from 'sinon';
import SystemError from '@test-helpers/SystemError';
import EncodedFile from './EncodedFile';
import Coder from './Coder';

describe('EncodedFile', () => {
  const coder = new Coder(Coder.generateSecretKey());
  let stubFs: SinonStubbedInstance<typeof fs>;

  beforeEach(() => {
    stubFs = stub(fs);
  });

  describe('#decode', () => {
    describe('when file exists', () => {
      const file = new EncodedFile(coder, 'data.txt');
      const expected = 'Hello World';

      beforeEach(async () => {
        const encodedData = await coder.encrypt(expected);
        stubFs.readFile.resolves(Buffer.from(encodedData, 'hex'));
      });

      it('should decode the file', async () => {
        const encodedData = await file.decode();
        equal(stubFs.readFile.calledOnce, true);
        equal(encodedData.toString('utf-8'), expected);
      });
    });

    describe('when file does not exist', () => {
      const file = new EncodedFile(coder, 'data.txt');
      const expected = '';

      beforeEach(() => {
        stubFs.readFile.rejects(new SystemError('ENOENT'));
      });

      it('should return empty buffer', async () => {
        const decodedData = await file.decode();
        equal(decodedData, expected);
      });
    });
  });

  describe('#encode', () => {
    const file = new EncodedFile(coder, 'data.txt');

    it('should encode the file', async () => {
      const data = Buffer.from('test');
      const encodedData = await file.encode(data);
      notEqual(encodedData, data);
    });
  });
});
