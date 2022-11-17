module.exports = (sequelize, DataTypes) => {
    const LoanApplications = sequelize.define("loanapplications", {
        applicant_id: {
            type: DataTypes.STRING,
          },
          appid: {
            type: DataTypes.STRING,
          },
         
          sector_id: {
            type: DataTypes.STRING,
          },
          subsector_id: {
            type: DataTypes.STRING,
          },
          application_status: {
            type: DataTypes.STRING,
          },
        
      typelatter: {
        type: DataTypes.STRING,
      },
      namelatter: {
        type: DataTypes.STRING,
      },
      datalatter: {
        type: DataTypes.BLOB("long"),
      },
      typelicense: {
        type: DataTypes.STRING,
      },
      namelicense: {
        type: DataTypes.STRING,
      },
      datalicense: {
        type: DataTypes.BLOB("long"),
      },
      typeland: {
        type: DataTypes.STRING,
      },
      nameland: {
        type: DataTypes.STRING,
      },
      dataland: {
        type: DataTypes.BLOB("long"),
      },
      typevat: {
        type: DataTypes.STRING,
      },
      namevat: {
        type: DataTypes.STRING,
      },
      datavat: {
        type: DataTypes.BLOB("long"),
      },
      typemerrage: {
        type: DataTypes.STRING,
      },
      namemerrage: {
        type: DataTypes.STRING,
      },
      datamerrage: {
        type: DataTypes.BLOB("long"),
      },
      typebank: {
        type: DataTypes.STRING,
      },
      namebank: {
        type: DataTypes.STRING,
      },
      databank: {
        type: DataTypes.BLOB("long"),
      }
     
    });
    return LoanApplications;
  };