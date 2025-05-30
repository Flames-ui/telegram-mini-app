const db = require('../config/database');
const storage = require('../services/storage');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique file hash (for deduplication)
    const fileHash = uuidv4();
    const fileInfo = await storage.saveFile(req.file);

    // Store metadata in PostgreSQL
    const [media] = await db('media').insert({
      original_name: fileInfo.originalName,
      storage_path: fileInfo.filePath,
      mime_type: fileInfo.mimetype,
      size_bytes: fileInfo.size,
      file_hash: fileHash,
      uploaded_by: req.user.id // From JWT
    }).returning('*');

    res.status(201).json(media);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const media = await db('media').where({ id: req.params.id }).first();
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Stream the file directly from storage
    const fileStream = fs.createReadStream(media.storage_path);
    fileStream.pipe(res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await db('media').where({ id: req.params.id }).first();
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Verify ownership or admin status
    if (media.uploaded_by !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from filesystem
    await storage.deleteFile(media.storage_path);

    // Delete from database
    await db('media').where({ id: req.params.id }).delete();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
