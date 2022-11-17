module.exports = (sequelize, DataTypes) => {
   
    const User = sequelize.define("user", {
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
        }

    });

  
    return User;
}