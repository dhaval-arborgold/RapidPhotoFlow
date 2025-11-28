const Photo = require('../models/Photo');
const Event = require('../models/Event');
const { writeDB, clearStorage } = require('../services/storageService');
const dbLock = require('../utils/databaseLock');
const logger = require('../middleware/logger');

exports.getStats = async (req, res) => {
  try {
    const photoStats = await Photo.getStats();
    const totalEvents = await Event.getCount();

    res.json({
      ...photoStats,
      totalEvents,
    });
  } catch (error) {
    logger.error('Error fetching stats', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

exports.resetData = async (req, res) => {
  try {
    await dbLock.withLock(async () => {
      await writeDB({ photos: [], events: [] });
    });
    
    await clearStorage();

    logger.info('🔄 All data cleared');
    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    logger.error('Error resetting data', error);
    res.status(500).json({ error: 'Failed to reset data' });
  }
};

exports.healthCheck = (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};