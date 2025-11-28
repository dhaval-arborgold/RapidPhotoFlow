const { v4: uuidv4 } = require('uuid');
const dbLock = require('../utils/databaseLock');
const { readDB, writeDB } = require('../services/storageService');
const logger = require('../middleware/logger');

class Event {
  static async create(photoId, event, details = {}) {
    return dbLock.withLock(async () => {
      try {
        const db = await readDB();
        const eventData = {
          id: uuidv4(),
          photoId,
          event,
          details,
          timestamp: new Date().toISOString(),
        };
        
        db.events.push(eventData);
        await writeDB(db);
        return eventData;
      } catch (error) {
        logger.error('Failed to add event', { photoId, event, error });
      }
    });
  }

  static async findAll(filter = {}, limit = 100) {
    const db = await readDB();
    let events = db.events;

    if (filter.photoId) {
      events = events.filter(e => e.photoId === filter.photoId);
    }

    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    events = events.slice(0, parseInt(limit, 10));

    return events;
  }

  static async getCount() {
    const db = await readDB();
    return db.events.length;
  }
}

module.exports = Event;