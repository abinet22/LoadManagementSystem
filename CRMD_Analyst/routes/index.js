const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const LoanApplication  = db.loanapplications;
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/forgetpassword', forwardAuthenticated, (req, res) => res.render('forgetpassword',{user:req.user}));
router.get('/dashboard', ensureAuthenticated, async function(req, res) 
{

  const appnew = await LoanApplication.count({where:{application_status:"New"}});
  const apponanalyst = await LoanApplication.count({where:{application_status:"Approve_And_Sent_To_CRMD_Analyst"}});
  
    LoanApplication.findAll({where:{application_status:"Approve_And_Sent_To_CRMD_Analyst"}}).then((loanapp)=>{
  
    if(loanapp){
      let errors =[];
      var i =0;
      loanapp.forEach(function(row){
        var date1 = new Date(row.updatedAt);
        var date2 = new Date() ;
        var Difference_In_Time = date2.getTime() - date1.getTime();
        
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        console.log( Math.floor(Difference_In_Days))
        
    if(Difference_In_Days > 5){
    i++;
  
      }
      })
      if(i>0)
      {
        errors.push({msg:"There Are " + i + " Loan Application On CRMD Analyst Waiting To Update More Than 5 Days"})
        
      }
      console.log(errors);
      res.render('dashboard',{
        user:req.user,appnew:appnew,apponanalyst:apponanalyst,errors,
        success_msg:"There Are "+apponanalyst+" Loan Applications Active On CRMD Analyst"
      })
      
    }
  
  });
  

});







router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});


router.post('/register', forwardAuthenticated,async function (req, res, next) {

  const {email,password,repassword,phonenumber,fullname} = req.body;
 
  const errors = [];
  const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  userid = uuidv4(v1options);

  const userData = {
    userid:userid,
  email: email,
  password:password,
  phonenumber: phonenumber,
  isactive:"Yes",
  fullname:fullname,
 
  }

 
  if (errors.length > 0) {
      res.render('login', {
          errors,
         userData
      });
  } else {

   
    User.findOne({
      where: {
        email: email
      }
  }).then(user => {
    //console.log(user);
    console.log(user);
          if (!user ) {
              bcrypt.hash(password, 10, (err, hash) => {
              userData.password = hash;


              User.create(userData)
                  .then(data => {
                    res.render('login',{success_msg:'Successfully Created'})
                  }).catch(err => {
                   
                  }) // end of then catch for create method
              }); // 
          } else {
           
          }
      }).catch(err => {
          res.send('ERROR: ' + err)
      }); // end of then catch for findOne method 


 
  }

 
}) // end of register Post router 


module.exports = router;
