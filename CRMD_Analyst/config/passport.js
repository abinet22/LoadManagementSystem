const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const Op = db.Sequelize.Op;
var existeduser;

// Load User model
//const User = require('../models/User');
var user;
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      SystemUser.findOne({ where:{email:email,userroll:"CRMD_Analyst"}}).then(data => {
      
        if(!data)
        {
            return done(null,false,{ message: 'Invalid Credential' });
        }
     //   const isValid=validPassword(password,results[0].hash,results[0].salt);
     existeduser={userid:data.userid,email:data.email,userroll:data.userroll,password:data.password,phonenumber:data.phonenumber};
     console.log(data);
        bcrypt.compare(password, existeduser.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, existeduser);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
    });
    
    })


  );
  passport.serializeUser(function(existeduser, done) {
    done(null, existeduser.userid);
  });

  passport.deserializeUser(function(userid, done) {
  SystemUser.findOne({where:{userid:userid}}).then(data => {
      done(null, data);    
});
  });

};
