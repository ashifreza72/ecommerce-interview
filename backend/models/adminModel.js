const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// Check if we're in Vercel production environment
const isVercelProduction = process.env.VERCEL_ENV === 'production';

// Create a mock Admin model for Vercel production
if (isVercelProduction) {
  // Export a mock Admin model with required methods
  module.exports = {
    findOne: async () => null,
    findByPk: async () => null,
    create: async (data) => {
      // Mock password hashing
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      return { id: 1, ...data };
    },
    count: async () => 0
  };
} else {
  // Regular Sequelize model for development
  const Admin = sequelize.define(
    'Admin',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'admins',
    }
  );

  // Hash password before saving
  Admin.beforeCreate(async (admin) => {
    if (admin.password) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }
  });

  module.exports = Admin;
}
