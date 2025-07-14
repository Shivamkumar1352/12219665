import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import shortUrlRoutes from './src/routes/shortUrl.routes.js';
import redirectHandler from './src/controllers/redirect.controller.js';
import { Log } from '../middleware/logger.js'; // ✅ Correct import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
try {
  connectDB();
} catch (err) {
  console.error('❌ DB Connection Failed:', err.message);
  process.exit(1);
}

// Routes
app.use('/shorturls', shortUrlRoutes);
app.get('/:shortcode', redirectHandler);

// Global error handler
app.use((err, req, res, next) => {
  Log('backend', 'error', 'handler', err.message).catch(console.error);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  Log('backend', 'info', 'config', `Server running on port ${PORT}`).catch(console.error);
});
