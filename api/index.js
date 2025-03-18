// api/index.js - Updated version
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { clerkClient, ClerkExpressWithAuth } from '@clerk/clerk-express';

// Import models directly (fixed paths)
import { User } from './models/user.model.js';
import { Song } from './models/song.model.js';
import { Album } from './models/album.model.js';
import { Message } from './models/message.model.js';

// Import controllers (fixed paths)
import * as songController from './controller/song.controller.js';
import * as albumController from './controller/album.controller.js';
import * as adminController from './controller/admin.controller.js';
import * as authController from './controller/auth.controller.js';
import * as userController from './controller/user.controller.js';
import * as statController from './controller/stat.controller.js';

// Import middlewares
import { protectRoute, requireAdmin } from './middleware/auth.middleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(ClerkExpressWithAuth());

// Improved MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10
      });
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
  // Inside connectDB function
try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10
      });
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process in serverless environment
  }
};

// Routes
// Auth routes
app.post('/api/auth/callback', authController.authCallback);

// Song routes
app.get('/api/songs', protectRoute, requireAdmin, songController.getAllSongs);
app.get('/api/songs/featured', songController.getFeaturedSongs);
app.get('/api/songs/made-for-you', songController.getMadeForYouSongs);
app.get('/api/songs/trending', songController.getTrendingSongs);

// Album routes
app.get('/api/albums', albumController.getAllAlbums);
app.get('/api/albums/:albumId', albumController.getAlbumById);

// Admin routes
app.get('/api/admin/check', protectRoute, requireAdmin, adminController.checkAdmin);
app.post('/api/admin/songs', protectRoute, requireAdmin, adminController.createSong);
app.delete('/api/admin/songs/:id', protectRoute, requireAdmin, adminController.deleteSong);
app.post('/api/admin/albums', protectRoute, requireAdmin, adminController.createAlbum);
app.delete('/api/admin/albums/:id', protectRoute, requireAdmin, adminController.deleteAlbum);

// User routes
app.get('/api/users', protectRoute, userController.getAllUsers);
app.get('/api/users/messages/:userId', protectRoute, userController.getMessages);

// Stats routes
app.get('/api/stats', protectRoute, requireAdmin, statController.getStats);

// Simple health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handle static files for production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(process.cwd(), 'frontend/dist')));
  
  // For any request that doesn't match one above, send back the index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend/dist/index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Connect to database before handling requests
connectDB();

export default app;