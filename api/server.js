import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Database test route
app.get('/api/db-test', async (req, res) => {
  try {
    // Try connecting to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    }
    res.status(200).json({ mongoStatus: 'connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;