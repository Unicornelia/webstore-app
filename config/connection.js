const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize({
  database: 'node-complete',
  username: 'root',
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

module.exports = sequelize;
