const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'node-complete',
  'root',
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.DB_HOST,
  }
);

module.exports = sequelize;
