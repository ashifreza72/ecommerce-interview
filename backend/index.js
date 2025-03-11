const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Fixed uploads path

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Sync Database & Start Server
sequelize.sync({ force: false }).then(() => {
  console.log('MySQL Database Synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
