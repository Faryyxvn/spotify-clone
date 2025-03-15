// api/server.js
import { createServer } from 'http';
import { app } from '../backend/src/index.js';

// Export the Express API as a Vercel serverless function
export default function handler(req, res) {
  // Forward the request to your Express app
  app(req, res);
}