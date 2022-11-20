module.exports = (sequelize, DataTypes) => {
    const ApplicantProfile = sequelize.define("applicantprofile", {
        applicant_id: {
            type: DataTypes.STRING,
          },
          applicant_f_name: {
            type: DataTypes.STRING,
          },
          applicant_m_name: {
            type: DataTypes.STRING,
          },
          applicant_l_name: {
            type: DataTypes.STRING,
          },
        
          
          age: {
            type: DataTypes.DECIMAL,
          },
          gender: {
            type: DataTypes.STRING,
          },
          date_of_birth: {
            type: DataTypes.DATE,
          },
       
          nationality: {
            type: DataTypes.STRING,
          },
          region: {
            type: DataTypes.STRING,
          },
          zone_woreda: {
            type: DataTypes.STRING,
          },
          city_kebele_hno: {
            type: DataTypes.STRING,
          },
          contact_phone_one: {
            type: DataTypes.STRING,
          },
          contact_phone_two: {
            type: DataTypes.STRING,
          },
          emergen_name: {
            type: DataTypes.STRING,
          },
          emergency_phone: {
            type: DataTypes.STRING,
          },
      
          recommedation: {
            type: DataTypes.STRING,
          },
        
          martialstatus: {
            type: DataTypes.STRING,
          },
  
            typeid: {
                type: DataTypes.STRING,
            },
            nameid: {
                type: DataTypes.STRING,
            },
            dataid: {
                type: DataTypes.BLOB("long"),
            }
     
    });
    return ApplicantProfile;
  };