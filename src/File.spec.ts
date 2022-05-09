import { equal, rejects, doesNotReject } from 'assert';
import fs from 'fs/promises';
import SystemError from '@test-helpers/SystemError';
import { stub, SinonStubbedInstance } from 'sinon';
import File from './File';

describe('File', () => {
  let stubFs: SinonStubbedInstance<typeof fs>;

  beforeEach(() => {
    stubFs = stub(fs);
  });

  describe('#read', () => {
    describe('when file exists', () => {
      const expected = 'Hello World';
      const filePath = 'data.txt';

      beforeEach(() => {
        stubFs.readFile.resolves(Buffer.from(expected));
      });

      it('should read file', async () => {
        const data = await new File(filePath).read();
        equal(stubFs.readFile.calledWith(filePath), true);
        equal(data, expected);
      });
    });

    describe('when file does not exist', () => {
      beforeEach(() => {
        stubFs.readFile.rejects(new SystemError('ENOENT'));
      });

      it('should throw error if file does not exist', async () => {
        const file = new File('does-not-exist.txt');
        await rejects(file.read(), new SystemError('ENOENT'));
      });
    });
  });

  describe('#write', () => {
    describe('when directory exists', () => {
      const data = Buffer.from('Hello World');
      const filePath = 'data.txt';

      beforeEach(() => {
        stubFs.writeFile.resolves();
      });

      it('should write file', async () => {
        const file = new File(filePath);
        await file.write(data);
        equal(stubFs.writeFile.calledWith(filePath, data), true);
      });
    });

    describe('when directory does not exist', () => {
      const filePath = '/nested/file.txt';
      const expected = 'Hello World!';

      beforeEach(() => {
        stubFs.writeFile.onFirstCall().rejects(new SystemError('ENOENT'));
        stubFs.writeFile.onSecondCall().resolves();
        stubFs.mkdir.resolves();
      });

      it('should write file', async () => {
        const file = await new File(filePath);
        await doesNotReject(file.write(expected, 'utf-8'));
        equal(stubFs.mkdir.calledWith('/nested'), true);
        equal(stubFs.writeFile.calledWith(filePath, expected), true);
      });
    });
  });

  describe('#remove', () => {
    describe('when file exists', () => {
      const filePath = 'file.txt';

      beforeEach(async () => {
        stubFs.unlink.resolves();
      });

      it('should remove file', async () => {
        const file = new File(filePath);
        await doesNotReject(file.remove());
        equal(stubFs.unlink.calledWith(filePath), true);
      });
    });

    describe('when file does not exist', () => {
      const filePath = 'file.txt';

      beforeEach(() => {
        stubFs.unlink.rejects(new SystemError('ENOENT'));
      });

      it('should throw error', async () => {
        const file = new File(filePath);
        await rejects(file.remove(), new SystemError('ENOENT'));
      });
    });
  });
});
