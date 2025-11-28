const path = require('path');
const fs = require('fs').promises;
const Photo = require('../models/Photo');
const Event = require('../models/Event');
const { processPhoto } = require('../services/photoProcessor');
const { UPLOAD_DIR } = require('../config/database');
const logger = require('../middleware/logger');

exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      const photo = await Photo.create(file);
      uploadedPhotos.push(photo);

      logger.info('📸 Photo uploaded', {
        photoId: photo.id,
        filename: file.originalname,
      });
    }

    // Add events and start processing
    for (const photo of uploadedPhotos) {
      await Event.create(photo.id, 'photo_uploaded', { 
        filename: photo.originalName, 
        size: photo.size 
      });

      // Start processing (don't await)
      processPhoto(photo.id).catch(err => 
        logger.error(`Processing failed for ${photo.id}`, err)
      );
    }

    logger.info('✅ Upload completed', { count: uploadedPhotos.length });
    
    res.status(201).json({ 
      message: 'Photos uploaded successfully', 
      photos: uploadedPhotos 
    });
  } catch (error) {
    logger.error('Upload error', error);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { status } = req.query;
    const photos = await Photo.findAll(status ? { status } : {});

    res.json({ photos, total: photos.length });
  } catch (error) {
    logger.error('Error fetching photos', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json(photo);
  } catch (error) {
    logger.error('Error fetching photo', error);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.delete(id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    try {
      await fs.unlink(path.join(UPLOAD_DIR, photo.filename));
    } catch (err) {
      logger.warn('File delete failed', { error: err.message });
    }

    await Event.create(id, 'photo_deleted', { filename: photo.originalName });

    logger.info('🗑️  Photo deleted', { photoId: id });
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    logger.error('Error deleting photo', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
};