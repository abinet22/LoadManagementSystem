const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const twilio = require('twilio');
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var api = require('../node_modules/clicksend/api.js');
const fetch = require('node-fetch');

const accountSid = 'AC83fd9a36e318c61f440ad2e655fdfe20'; // Your Account SID from www.twilio.com/console
const authToken = '94c521c306b0b66cb48ffc85e05a7372'; // Your Auth Token from www.twilio.com/console


const client = new twilio(accountSid, authToken);
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
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


router.post('/register', forwardAuthenticated,async function (req, res, next) {

  const {email,password,repassword,phonenumber,fullname} = req.body;
  const accountSid = "AC83fd9a36e318c61f440ad2e655fdfe20";
  const authToken = "94c521c306b0b66cb48ffc85e05a7372";
  const client = require('twilio')(accountSid, authToken);
  
 
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
                   
                    var smsMessage = new api.SmsMessage();

                    smsMessage.from = "myNumber";
                    smsMessage.to = '+251922407020';
                  
                      smsMessage.body = "This Is Notification Message From ETProcurementFSS.You Can pay Subscription Payment Through This Account 002322432424";
                    
                    var smsApi = new api.SMSApi("info@techlinktechnologies.com", "949DC10D-C1F5-31FD-7CCD-003801BA9D2B");
    
    var smsCollection = new api.SmsMessageCollection();
    
    smsCollection.messages = [smsMessage];
    
    smsApi.smsSendPost(smsCollection).then(function(response) {
      console.log(response.body);
    }).catch(function(err){
      console.error(err.body);
    });     
                      // client.messages
                      //   .create({
                      //     body: 'Hello from Node',
                      //     to: '+251913863171', // Text this number
                      //     from: '+13465365233', // From a valid Twilio number
                      //   })
                      //   .then(message => {
                          
                      //     console.log(message)
                      //     res.send(message)
                      //   }
                      //   );
                         
                      
                    
                   
                   
                    
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
