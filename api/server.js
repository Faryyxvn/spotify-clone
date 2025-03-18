// Add this to the end of backend/src/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db.js';
// Import your routes and other code...

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Your route registrations...
app.use('/api/songs', songRoutes);
// Other routes...

// For vercel serverless function
if (process.env.NODE_ENV !== 'production') {
  connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for serverless
export default app;