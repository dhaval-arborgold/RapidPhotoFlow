const fs = require('fs').promises;
const path = require('path');

const getImageMetadata = async (filePath) => {
  try {
    const sharp = require('sharp');
    const stats = await fs.stat(filePath);
    const metadata = await sharp(filePath).metadata();
    
    return {
      dimensions: `${metadata.width}x${metadata.height}`,
      size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
      format: metadata.format.toUpperCase(),
    };
  } catch (error) {
    // Fallback if sharp is not available or image processing fails
    const stats = await fs.stat(filePath);
    return {
      dimensions: 'Unknown',
      size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
      format: path.extname(filePath).slice(1).toUpperCase(),
    };
  }
};

module.exports = { getImageMetadata };