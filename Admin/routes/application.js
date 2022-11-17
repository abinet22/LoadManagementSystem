const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/forgetpassword', forwardAuthenticated, (req, res) => res.render('forgetpassword',{user:req.user}));
router.get('/dashboard', ensureAuthenticated, async function(req, res) 
{
res.render('dashboard',{
  user:req.user,
})
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


router.post('/addnewsystemuser', ensureAuthenticated,async function (req, res, next) {

  const {email,password} = req.body;
 
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
  email: "admin@gmail.com",
  password:password,
  phonenumber:"0913863171",
  isactive:"Yes",
  fullname:"Admin",
  userroll:"Admin"
  }

 
  if (errors.length > 0) {
      res.render('login', {
          errors,
         userData
      });
  } else {

   
    SystemUser.findAll({
      where: {
        email: email
      }
  }).then(user => {
    //console.log(user);
    console.log(user);
          if (user.length ==0 ) {
              bcrypt.hash(password, 10, (err, hash) => {
              userData.password = hash;


              SystemUser.create(userData)
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
