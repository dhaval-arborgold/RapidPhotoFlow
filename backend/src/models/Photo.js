const { v4: uuidv4 } = require('uuid');
const dbLock = require('../utils/databaseLock');
const { readDB, writeDB } = require('../services/storageService');
const logger = require('../middleware/logger');

class Photo {
  static async create(fileData) {
    return dbLock.withLock(async () => {
      const db = await readDB();
      const photo = {
        id: uuidv4(),
        filename: fileData.filename,
        originalName: fileData.originalname,
        url: `/uploads/${fileData.filename}`,
        size: fileData.size,
        mimetype: fileData.mimetype,
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      db.photos.push(photo);
      await writeDB(db);
      return photo;
    });
  }

  static async findAll(filter = {}) {
    const db = await readDB();
    let photos = db.photos;

    if (filter.status) {
      photos = photos.filter(p => p.status === filter.status);
    }

    photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return photos;
  }

  static async findById(id) {
    const db = await readDB();
    return db.photos.find(p => p.id === id);
  }

  static async updateProgress(photoId, progress, status) {
    return dbLock.withLock(async () => {
      try {
        const db = await readDB();
        const photoIndex = db.photos.findIndex(p => p.id === photoId);
        
        if (photoIndex !== -1) {
          db.photos[photoIndex].progress = progress;
          db.photos[photoIndex].status = status;
          db.photos[photoIndex].updatedAt = new Date().toISOString();
          await writeDB(db);
        }
      } catch (error) {
        logger.error('Failed to update progress', { photoId, error });
      }
    });
  }

  static async update(photoId, updates) {
    return dbLock.withLock(async () => {
      const db = await readDB();
      const photoIndex = db.photos.findIndex(p => p.id === photoId);
      
      if (photoIndex !== -1) {
        db.photos[photoIndex] = {
          ...db.photos[photoIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        await writeDB(db);
        return db.photos[photoIndex];
      }
      return null;
    });
  }

  static async delete(id) {
    return dbLock.withLock(async () => {
      const db = await readDB();
      const index = db.photos.findIndex(p => p.id === id);

      if (index === -1) {
        return null;
      }

      const photo = db.photos[index];
      db.photos.splice(index, 1);
      await writeDB(db);
      
      return photo;
    });
  }

  static async getStats() {
    const db = await readDB();
    return {
      total: db.photos.length,
      pending: db.photos.filter(p => p.status === 'pending').length,
      processing: db.photos.filter(p => p.status === 'processing').length,
      completed: db.photos.filter(p => p.status === 'completed').length,
      failed: db.photos.filter(p => p.status === 'failed').length,
    };
  }
}

module.exports = Photo;