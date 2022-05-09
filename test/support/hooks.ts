import { restore } from 'sinon';

export default {
  afterEach() {
    restore();
  },
};
