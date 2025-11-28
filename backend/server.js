const app = require('./src/app');
const { initializeStorage } = require('./src/services/storageService');
const logger = require('./src/middleware/logger');

const PORT = process.env.PORT || 3000;

initializeStorage().then(() => {
  app.listen(PORT, () => {
    logger.info('🚀 RapidPhotoFlow Backend started', {
      port: PORT,
      url: `http://localhost:${PORT}`,
    });
  });
}).catch(error => {
  logger.error('Failed to initialize storage', error);
  process.exit(1);
});