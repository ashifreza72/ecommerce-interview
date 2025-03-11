const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT || 'mysql';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

sequelize
  .authenticate()
  .then(() => console.log(`${dbDialect} Database Connected Successfully!`))
  .catch((err) => console.error(`❌ ${dbDialect} Connection Error:`, err));

module.exports = sequelize;
