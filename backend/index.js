const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Only create uploads directory in development
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Import routes
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message 
    });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: err.message
    });
  }
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server only in development
// In production, we export the app for serverless
if (process.env.NODE_ENV !== 'production') {
  const sequelize = require('./config/db');
  const PORT = process.env.PORT || 5000;
  
  sequelize.sync({ force: false }).then(() => {
    console.log('MySQL Database Synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

// Export for serverless
module.exports = app;
