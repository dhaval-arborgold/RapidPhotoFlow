const express = require('express');
const router = express.Router();
const photoRoutes = require('./photoRoutes');
const eventRoutes = require('./eventRoutes');
const statsRoutes = require('./statsRoutes');
const statsController = require('../controllers/statsController');

router.get('/health', statsController.healthCheck);
router.use('/photos', photoRoutes);
router.use('/events', eventRoutes);
router.use('/stats', statsRoutes);
router.post('/reset', statsController.resetData);

module.exports = router;