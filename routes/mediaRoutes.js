const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload media (authenticated users only)
router.post('/upload', authenticate, upload.single('file'), mediaController.uploadMedia);

// Get media by ID (public)
router.get('/:id', mediaController.getMedia);

// Delete media (admin only)
router.delete('/:id', authenticate, mediaController.deleteMedia);

module.exports = router;
