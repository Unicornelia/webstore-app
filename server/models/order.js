const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = Order;
