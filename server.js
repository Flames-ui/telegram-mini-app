import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ PostgreSQL Setup
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // for Render PostgreSQL
});

// ✅ CORS Setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS Not Allowed'));
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json({ limit: `${process.env.UPLOAD_LIMIT_MB || 10}mb` }));
app.use(express.urlencoded({ extended: true }));

// ✅ Storage Path
const storagePath = process.env.STORAGE_PATH || './storage';
if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });

// ✅ File Upload (Multer)
const upload = multer({
  dest: storagePath,
  limits: { fileSize: parseInt(process.env.UPLOAD_LIMIT_MB || '10') * 1024 * 1024 },
});

// ✅ JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// ✅ Routes

app.get('/', (req, res) => {
  res.send('🔥 Anointed Flames TV Backend Running!');
});

// 🔐 Protected Route Example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.id}` });
});

// 📤 Upload Route Example
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
});

// 🧪 Auth Route (Test Purpose)
app.post('/api/login', async (req, res) => {
  const { username } = req.body;

  // Simulate user fetch
  const userId = username || 'user1';

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.json({ token });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
