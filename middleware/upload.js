const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.mimetype.startsWith('image/')) folder += 'images/';
    else if (file.mimetype.startsWith('video/')) folder += 'videos/';
    cb(null, path.join(__dirname, '../../storage', folder));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

exports.upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * parseInt(process.env.UPLOAD_LIMIT_MB) },
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    cb(null, validTypes.includes(file.mimetype));
  }
});
