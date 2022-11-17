module.exports = (sequelize, DataTypes) => {
   
    const SystemUser = sequelize.define("systemuser", {
        userid: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        phonenumber: {
            type: DataTypes.STRING,
        },
        isactive: {
            type: DataTypes.STRING,
        },
        fullname: {
            type: DataTypes.STRING,
        },
        userroll: {
            type: DataTypes.STRING,
        }

    });

  
    return SystemUser;
}