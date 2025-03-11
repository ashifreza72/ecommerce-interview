const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if running in production (Vercel)
if (process.env.NODE_ENV === 'production') {
  // Use a connection string for production if available
  const connectionString = process.env.DATABASE_URL;
  
  if (connectionString) {
    sequelize = new Sequelize(connectionString, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    });
  } else {
    // Fallback to individual connection parameters
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        logging: false
      }
    );
  }
} else {
  // Local development connection
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false
    }
  );
}

// Don't immediately authenticate in production
// This will be done when a connection is needed
if (process.env.NODE_ENV !== 'production') {
  sequelize
    .authenticate()
    .then(() => console.log('MySQL Database Connected Successfully!'))
    .catch((err) => console.error('❌ MySQL Connection Error:', err));
}

module.exports = sequelize;
