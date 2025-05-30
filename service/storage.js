const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class StorageService {
  constructor() {
    this.basePath = path.join(__dirname, '../../storage');
  }

  async saveFile(file, subfolder = '') {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(this.basePath, subfolder, fileName);
    
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.rename(file.path, filePath);
    
    return filePath;
  }

  async deleteFile(filePath) {
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (err) {
      console.error('File deletion error:', err);
      return false;
    }
  }
}

module.exports = new StorageService();
