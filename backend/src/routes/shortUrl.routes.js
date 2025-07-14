import express from 'express';
import Url from '../models/url.model.js';
import { nanoid } from 'nanoid';
import { log } from '../../../middleware/logger.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  try {
    let code = shortcode || nanoid(5);
    const exists = await Url.findOne({ shortcode: code });
    if (exists) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + validity * 60000);

    const newUrl = await Url.create({
      originalUrl: url,
      shortcode: code,
      expiresAt
    });

    log('backend', 'info', 'controller', `Created short URL for ${url}`);
    res.status(201).json({
      shortLink: `http://localhost:${process.env.PORT || 8000}/${code}`,
      expiry: expiresAt.toISOString()
    });
  } catch (err) {
    log('backend', 'error', 'controller', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortcode });

    if (!url) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clicks: url.clicks.length,
      clickDetails: url.clicks
    });
  } catch (err) {
    log('backend', 'error', 'controller', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
