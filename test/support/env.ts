import path from 'path';

process.env.NODE_ENV = 'test';
process.env.FIXTURES_PATH = path.join(__dirname, '../fixtures');
