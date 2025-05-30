const multer = require('multer');
const path = require('path');
const storage = require('../services/storage');

const fileFilter = (req, file, cb) => {
  const validTypes = [
    'image/jpeg', 
    'image/png', 
    'image/webp',
    'video/mp4',
    'video/quicktime'
  ];
  
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.env.STORAGE_PATH, 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: parseInt(process.env.UPLOAD_LIMIT_MB) * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;
