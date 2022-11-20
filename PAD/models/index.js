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
db.users = require("./User.js")(sequelize, Sequelize);
db.systemusers = require("./SystemUser.js")(sequelize, Sequelize);
db.loansector = require("./LoanSector.js")(sequelize, Sequelize);
db.loansubsector = require("./LoanSubSector.js")(sequelize, Sequelize);
db.applicantprofiles = require("./ApplicantProfile.js")(sequelize, Sequelize);
db.loanapplications = require("./LoanApplication.js")(sequelize, Sequelize);
db.cadreviews = require("./CADReview.js")(sequelize, Sequelize);
db.analystworks = require("./AnalystWork.js")(sequelize, Sequelize);


module.exports = db;