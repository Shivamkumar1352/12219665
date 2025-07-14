import Url from '../models/url.model.js';
import { log } from '../../../middleware/logger.js';

const redirectHandler = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortcode });

    if (!url) {
      log('backend', 'error', 'handler', 'Shortcode not found');
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (new Date() > url.expiresAt) {
      log('backend', 'warn', 'handler', 'Shortcode expired');
      return res.status(410).json({ error: 'Shortcode expired' });
    }

    const click = {
      timestamp: new Date(),
      referrer: req.get('Referer') || 'Direct',
      location: req.ip
    };
    url.clicks.push(click);
    await url.save();

    log('backend', 'info', 'handler', `Redirected to ${url.originalUrl}`);
    res.redirect(url.originalUrl);
  } catch (err) {
    log('backend', 'error', 'handler', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default redirectHandler;
