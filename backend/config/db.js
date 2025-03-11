const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // Use environment variables for production database
  sequelize = new Sequelize(
    process.env.DB_NAME || 'ecommerce',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'Ashif@72',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    }
  );
} else {
  // Local development database
  sequelize = new Sequelize('ecommerce', 'root', 'Ashif@72', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  });
}

sequelize
  .authenticate()
  .then(() => console.log('MySQL Database Connected Successfully!'))
  .catch((err) => console.error('❌ MySQL Connection Error:', err));

module.exports = sequelize;
