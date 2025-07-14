import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  location: String
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortcode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  clicks: [clickSchema]
});

export default mongoose.model('Url', urlSchema);