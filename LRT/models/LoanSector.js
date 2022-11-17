module.exports = (sequelize, DataTypes) => {
   
    const LoanSector = sequelize.define("loansector", {
       
        sectorid: {
            type: DataTypes.STRING,
        },
        secdesc: {
            type: DataTypes.STRING,
        },
        sectorname: {
            type: DataTypes.STRING,
        },
       

    });

  
    return LoanSector;
}