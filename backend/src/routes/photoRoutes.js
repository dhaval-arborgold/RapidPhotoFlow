const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const photoController = require('../controllers/photoController');

router.post('/upload', upload.array('photos', 10), photoController.uploadPhotos);
router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhotoById);
router.delete('/:id', photoController.deletePhoto);

module.exports = router;