const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const dbConfig = config['development'];

const dbCredentials = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

const db = {};


db.employee = require('./employee')(dbCredentials, Sequelize);
db.department = require('./department')(dbCredentials, Sequelize);

db.department.hasOne(db.employee, {
    foreignKey: 'id'
  });
  db.employee.belongsTo(db.department, {
    foreignKey: 'department_id'
  });

module.exports = db;

