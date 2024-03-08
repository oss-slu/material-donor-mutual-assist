const Sequelize = require('sequelize');
const db = require('./database-setup'); // Import the database connection

const Admin = db.define('admin', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.TEXT,
  },
});

module.exports = Admin;
