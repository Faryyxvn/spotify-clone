// api/server.js
import { createServer } from 'http';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const server = require('../backend/dist/server.js');

export default server;