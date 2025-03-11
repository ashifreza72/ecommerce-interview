const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', 'Ashif@72', {
  host: 'localhost',
  dialect: 'mysql', // Correct way
  logging: false, // Optional: To disable console logs of queries
});

sequelize
  .authenticate()
  .then(() => console.log(' MySQL Database Connected Successfully!'))
  .catch((err) => console.error('❌ MySQL Connection Error:', err));

module.exports = sequelize;
