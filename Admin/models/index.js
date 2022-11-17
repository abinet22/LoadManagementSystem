const dbConfig = require("../config/dbconfig.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../models/User.js")(sequelize, Sequelize);
db.systemusers = require("../models/SystemUser.js")(sequelize, Sequelize);
db.loansector = require("../models/LoanSector.js")(sequelize, Sequelize);
db.loansubsector = require("../models/LoanSubSector.js")(sequelize, Sequelize);


module.exports = db;