const Event = require('../models/Event');
const logger = require('../middleware/logger');

exports.getEvents = async (req, res) => {
  try {
    const { photoId, limit = 100 } = req.query;
    const filter = photoId ? { photoId } : {};
    const events = await Event.findAll(filter, limit);

    res.json({ events, total: events.length });
  } catch (error) {
    logger.error('Error fetching events', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};
