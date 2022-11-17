module.exports = (sequelize, DataTypes) => {
   
    const LoanSubSector = sequelize.define("loansubsector", {
        subsectorid: {
            type: DataTypes.STRING,
        },
        sectorid: {
            type: DataTypes.STRING,
        },
        subsecdesc: {
            type: DataTypes.STRING,
        },
        subsectorname: {
            type: DataTypes.STRING,
        },
       

    });

  
    return LoanSubSector;
}