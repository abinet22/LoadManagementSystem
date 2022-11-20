module.exports = (sequelize, DataTypes) => {
   
    const CADReveiw = sequelize.define("cadreview", {
        reviewid: {
            type: DataTypes.STRING,
        },
        
        reviewedby: {
            type: DataTypes.STRING,
        },
        applicationid: {
            type: DataTypes.STRING,
        },
        applicantid: {
            type: DataTypes.STRING,
        },
        reason: {
            type: DataTypes.STRING,
        },
       
        reviewstatus: {
            type: DataTypes.STRING,
        },
        isread: {
            type: DataTypes.STRING,
        }
    });

  
    return CADReveiw;
}