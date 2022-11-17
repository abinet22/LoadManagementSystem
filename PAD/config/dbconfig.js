  module.exports = {
    HOST: "localhost",
    USER: "admin",
    PASSWORD: "R1445o123/",
    DB: "loanmanagement",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };