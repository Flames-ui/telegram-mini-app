const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

class StorageService {
  constructor() {
    this.basePath = process.env.STORAGE_PATH;
  }

  async saveFile(file, subfolder = '') {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(this.basePath, subfolder, fileName);
    
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.rename(file.path, filePath);
    
    return {
      originalName: file.originalname,
      fileName,
      filePath,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  async processImage(file, options = {}) {
    const { width, height, quality } = options;
    const processedBuffer = await sharp(file.path)
      .resize(width, height, { fit: 'inside' })
      .jpeg({ quality: quality || 80 })
      .toBuffer();
      
    return this.saveBuffer(processedBuffer, 'processed', 'jpg');
  }

  async saveBuffer(buffer, subfolder, extension) {
    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(this.basePath, subfolder, fileName);
    
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, buffer);
    
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
