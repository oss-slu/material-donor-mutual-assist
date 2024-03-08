const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost', // Replace with your container name if different
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'mdma',
  logging: false, // Set to true for detailed logging (optional)
});

module.exports = sequelize;