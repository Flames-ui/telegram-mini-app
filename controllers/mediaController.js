const db = require('../config/database');
const storage = require('../services/storage');

class MediaController {
  async uploadMedia(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileInfo = await storage.saveFile(req.file);
      
      const [media] = await db('media').insert({
        original_name: fileInfo.originalName,
        storage_path: fileInfo.filePath,
        mime_type: fileInfo.mimetype,
        size_bytes: fileInfo.size,
        file_hash: '' // Add hash calculation if needed
      }).returning('*');

      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMedia(req, res) {
    try {
      const media = await db('media')
        .where({ id: req.params.id })
        .first();

      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      res.json(media);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MediaController();
