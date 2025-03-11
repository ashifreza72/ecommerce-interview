const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if running in Vercel production environment
if (process.env.VERCEL_ENV === 'production') {
  // Create a dummy sequelize instance for Vercel
  console.log('Running in Vercel production environment - using mock database');
  
  // Export a mock sequelize object with required methods
  module.exports = {
    authenticate: async () => true,
    sync: async () => true,
    define: () => ({
      findAll: async () => [],
      findOne: async () => null,
      findByPk: async () => null,
      create: async () => ({}),
      update: async () => [0],
      destroy: async () => 0,
      count: async () => 0
    }),
    // Add other methods as needed
  };
} else {
  try {
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

    sequelize
      .authenticate()
      .then(() => console.log('MySQL Database Connected Successfully!'))
      .catch((err) => console.error('❌ MySQL Connection Error:', err));
    
    module.exports = sequelize;
  } catch (error) {
    console.error('Failed to initialize Sequelize:', error);
    
    // Provide a fallback mock object
    module.exports = {
      authenticate: async () => true,
      sync: async () => true,
      define: () => ({
        findAll: async () => [],
        findOne: async () => null,
        findByPk: async () => null,
        create: async () => ({}),
        update: async () => [0],
        destroy: async () => 0,
        count: async () => 0
      })
    };
  }
}
