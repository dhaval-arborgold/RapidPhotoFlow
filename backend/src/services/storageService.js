const fs = require('fs').promises;
const { DB_FILE, UPLOAD_DIR } = require('../config/database');
const logger = require('../middleware/logger');

const initializeStorage = async () => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
    // Validate JSON
    const content = await fs.readFile(DB_FILE, 'utf-8');
    JSON.parse(content);
    logger.info('Database file found');
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ photos: [], events: [] }, null, 2));
    logger.info('Database file created');
  }
};

const readDB = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    if (!data || data.trim() === '') {
      logger.warn('Empty database file, reinitializing');
      return { photos: [], events: [] };
    }
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to read database', error);
    return { photos: [], events: [] };
  }
};

const writeDB = async data => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const tempFile = `${DB_FILE}.tmp`;
    await fs.writeFile(tempFile, jsonString, 'utf-8');
    await fs.rename(tempFile, DB_FILE);
  } catch (error) {
    logger.error('Failed to write database', error);
    throw error;
  }
};

const clearStorage = async () => {
  const files = await fs.readdir(UPLOAD_DIR);
  await Promise.all(
    files.map(file => fs.unlink(require('path').join(UPLOAD_DIR, file)).catch(() => {}))
  );
};

module.exports = { initializeStorage, readDB, writeDB, clearStorage };