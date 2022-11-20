module.exports = (sequelize, DataTypes) => {
   
    const AnalystWork = sequelize.define("analystwork", {
        jobid: {
            type: DataTypes.STRING,
        },
        
        applicationid: {
            type: DataTypes.STRING,
        },
        analystid: {
            type: DataTypes.STRING,
        },
    
    });

  
    return AnalystWork;
}