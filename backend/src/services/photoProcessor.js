const path = require('path');
const Photo = require('../models/Photo');
const Event = require('../models/Event');
const { getImageMetadata } = require('../utils/imageMetadata');
const { UPLOAD_DIR } = require('../config/database');
const logger = require('../middleware/logger');

const processPhoto = async photoId => {
  logger.info('🔄 Starting photo processing', { photoId });

  try {
    // Step 1: Update to processing (10%)
    await Photo.updateProgress(photoId, 10, 'processing');
    await Event.create(photoId, 'processing_started', { status: 'processing', progress: 10 });
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2: Analyzing image (30%)
    await Photo.updateProgress(photoId, 30, 'processing');
    await Event.create(photoId, 'progress_update', { progress: 30, stage: 'analyzing' });
    await new Promise(resolve => setTimeout(resolve, 800));

    // Step 3: Processing filters (50%)
    await Photo.updateProgress(photoId, 50, 'processing');
    await Event.create(photoId, 'progress_update', { progress: 50, stage: 'filtering' });
    await new Promise(resolve => setTimeout(resolve, 700));

    // Step 4: Optimizing (70%)
    await Photo.updateProgress(photoId, 70, 'processing');
    await Event.create(photoId, 'progress_update', { progress: 70, stage: 'optimizing' });
    await new Promise(resolve => setTimeout(resolve, 600));

    // Step 5: Finalizing (90%)
    await Photo.updateProgress(photoId, 90, 'processing');
    await Event.create(photoId, 'progress_update', { progress: 90, stage: 'finalizing' });
    await new Promise(resolve => setTimeout(resolve, 400));

    // Step 6: Determine success (95% success rate)
    const success = Math.random() > 0.05;
    
    const photo = await Photo.findById(photoId);
    
    if (!photo) {
      logger.warn('Photo disappeared during processing', { photoId });
      return;
    }

    if (success) {
      // Get real image metadata
      const filePath = path.join(UPLOAD_DIR, photo.filename);
      const metadata = await getImageMetadata(filePath);
      
      // SUCCESS - Complete at 100%
      await Photo.update(photoId, {
        status: 'completed',
        progress: 100,
        processedUrl: photo.url,
        metadata,
        error: undefined,
      });
      
      await Event.create(photoId, 'processing_completed', { status: 'completed', progress: 100 });
      
      logger.info('✅ Photo processing completed', { 
        photoId, 
        filename: photo.originalName,
        metadata
      });
    } else {
      // FAILURE
      await Photo.update(photoId, {
        status: 'failed',
        progress: 0,
        error: 'Processing failed due to quality issues',
      });
      
      await Event.create(photoId, 'processing_failed', { 
        status: 'failed', 
        error: 'Processing failed due to quality issues' 
      });
      
      logger.warn('❌ Photo processing failed', { 
        photoId, 
        filename: photo.originalName
      });
    }

  } catch (error) {
    logger.error('💥 Error during processing', { photoId, error: error.message });
    
    try {
      await Photo.update(photoId, {
        status: 'failed',
        progress: 0,
        error: `Processing error: ${error.message}`,
      });
      
      await Event.create(photoId, 'processing_failed', { 
        status: 'failed', 
        error: error.message 
      });
    } catch (writeError) {
      logger.error('Failed to mark photo as failed', { photoId, error: writeError });
    }
  }
};

module.exports = { processPhoto };