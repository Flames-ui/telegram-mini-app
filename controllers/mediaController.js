const db = require('../config/database');
const storage = require('../services/storage');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const [media] = await db('media')
      .insert({
        original_name: req.file.originalname,
        storage_path: req.file.path,
        mime_type: req.file.mimetype,
        uploaded_by: req.user.id
      })
      .returning('*');

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
