const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if running in Vercel production environment
if (process.env.VERCEL_ENV === 'production') {
  console.log('Running in Vercel production environment - using mock database');
  
  // Create a more complete mock Sequelize instance
  const mockSequelize = {
    authenticate: async () => true,
    sync: async () => true,
    define: (modelName, attributes, options) => {
      // Return a mock model with common methods
      return {
        findAll: async () => [],
        findOne: async () => null,
        findByPk: async () => null,
        create: async (data) => ({ id: 1, ...data }),
        update: async () => [0],
        destroy: async () => 0,
        count: async () => 0,
        // Add hooks support
        beforeCreate: () => {},
        afterCreate: () => {},
        beforeUpdate: () => {},
        afterUpdate: () => {}
      };
    },
    // Add DataTypes for model definitions
    DataTypes: {
      STRING: 'STRING',
      TEXT: 'TEXT',
      INTEGER: 'INTEGER',
      FLOAT: 'FLOAT',
      BOOLEAN: 'BOOLEAN',
      DATE: 'DATE'
    }
  };
  
  module.exports = mockSequelize;
} else {
  // Local development connection
  const sequelize = new Sequelize(
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
}
