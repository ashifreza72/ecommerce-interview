const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define(
  'Admin',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    timestamps: true,
  }
);

Admin.beforeCreate(async (admin) => {
  admin.password = await bcrypt.hash(admin.password, 10);
});

module.exports = Admin;
