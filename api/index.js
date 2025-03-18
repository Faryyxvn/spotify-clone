import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { clerkClient, ClerkExpressWithAuth } from '@clerk/express';

// Import your models
import { User } from '../backend/src/models/user.model.js';
import { Song } from '../backend/src/models/song.model.js';
import { Album } from '../backend/src/models/album.model.js';
import { Message } from '../backend/src/models/message.model.js';

// Import controllers
import * as songController from '../backend/src/controller/song.controller.js';
import * as albumController from '../backend/src/controller/album.controller.js';
import * as adminController from '../backend/src/controller/admin.controller.js';
import * as authController from '../backend/src/controller/auth.controller.js';
import * as userController from '../backend/src/controller/user.controller.js';
import * as statController from '../backend/src/controller/stat.controller.js';

// Import middlewares
import { protectRoute, requireAdmin } from '../backend/src/middleware/auth.middleware.js';

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

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Failed to connect to MongoDB', error);
    return;
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

// Connect to database
connectDB();

export default app;