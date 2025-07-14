import mongoose from 'mongoose';
import { log } from '../../../middleware/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log('backend', 'info', 'db', 'Connected to MongoDB');
  } catch (err) {
    log('backend', 'fatal', 'db', 'Critical database connection failure.');
    process.exit(1);
  }
};

export default connectDB;