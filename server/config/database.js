const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'node-complete',
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  }
);

module.exports = sequelize;
