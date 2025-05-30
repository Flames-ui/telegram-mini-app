require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/database');

// Initialize Express
const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS.split(',') }));
app.use(express.json({ limit: '50mb' }));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Database connection
db.raw('SELECT 1')
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Storage path: ${require('./services/storage').basePath}`);
});
// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
