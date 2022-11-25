const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const db = require('../models');
const fs= require('fs');
const sendmail = require('sendmail');
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

//onst accountSid = 'AC83fd9a36e318c61f440ad2e655fdfe20'; // Your Account SID from www.twilio.com/console
//const authToken = '94c521c306b0b66cb48ffc85e05a7372'; // Your Auth Token from www.twilio.com/console
const { MailtrapClient } = require("mailtrap");
 const accountSid = "AC859838e47a28b47340b62c9817dfb542";
 const authToken = "5859bcfdc96fd3e4ee397c6dbb18d1bf";


// For this example to work, you need to set up a sending domain,
// and obtain a token that is authorized to send from the domain
//const TOKEN = "f9595f3bce9c03d4c553cb871407b2ae";
const client = require('twilio')(accountSid, authToken);

//const client = new twilio(accountSid, authToken);
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
 
  if (!fullname || !email || !password || !repassword) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != repassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 3) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
      res.render('register', {
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
//                     const SENDER_EMAIL = "info@techlinktechnologies.com";
// const RECIPIENT_EMAIL = "abinet22@gmail.com";
// const client = new MailtrapClient({ token: TOKEN });

// const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

// client
//   .send({
//     from: sender,
//     to: [{ email: RECIPIENT_EMAIL }],
//     subject: "Hello from Mailtrap!",
//     text: "Welcome to Mailtrap Sending!",
//   })
//   .then(console.log, console.error);
                  //   let transporter = nodeMailer.createTransport({
                  //     host: 'smtp.mailgun.org',
                  //     //port: 465,
                  //     secure: true,
                  //     auth: {
                  //         user: 'sandboxc47a5cb4681f40e7813ee12c23027a0d.mailgun.org',
                  //         pass: '8df8aa6353b34774a42170f3cf5b9238-a3d67641-0d10035a'
                  //     },
                  // tls:{
                  //   rejectUnauthorized: false
                  // }
                  // }); 
                  // let mailOptions = {
                  //     from: '"Rahul Kumar" <rahulkumarx@gmail.com>', // sender address
                  //     to: 'abinet22@gmail.com', // list of receivers
                  // replyTo:'abinet22@gmail.com',
                  //     subject: "ssfsf", // Subject line
                  //     text: "abcd" // plain text body          
                  
                  // };
                
                  // transporter.sendMail(mailOptions, (error, info) => {
                  //     if (error) {
                  //         return console.log(error);
                  //     }
                  //     console.log('Message %s sent: %s', info.messageId, info.response);
                  //         res.render('index');
                  //     });
                   
    //                 var smsMessage = new api.SmsMessage();

    //                 smsMessage.from = "myNumber";
    //                 smsMessage.to = '+251911369415';
                  
    //                   smsMessage.body = "This Is Notification Message From ETProcurementFSS.You Can pay Subscription Payment Through This Account 002322432424";
                    
    //                 var smsApi = new api.SMSApi("info@techlinktechnologies.com", "949DC10D-C1F5-31FD-7CCD-003801BA9D2B");
    
    // var smsCollection = new api.SmsMessageCollection();
    
    // smsCollection.messages = [smsMessage];              
    
    // smsApi.smsSendPost(smsCollection).then(function(response) {
    //   console.log(response.body);
    //   req.flash(
    //     'success_msg',
    //     'You are now registered and can log in'
    //   );
    //   res.redirect('/login');
               
    // }).catch(err=>{
    //   console.log(err);
    // });     
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
                    //   //   );
                 
                  //  sendmail({
                  //     from: 'no-reply@techlinktechnologies.com',
                  //     to: 'abinet22@gmail.com',
                  //     subject: 'test sendmail',
                  //     html: 'Mail of test sendmail ',
                  //   }, function(err, reply) {
                  //     console.log(err && err.stack);
                  //     console.dir(reply);
                  // });
                  const transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                      user: 'abinet22@gmail.com',
                      pass: 'weihsrnqoubzzpcd',
                    },
                  });
                  transporter.verify().then(console.log).catch(console.error);
             
                let mailOptions = {
                  from: 'abinet22@gmail.com', // sender address
                  to: 'amhatefera2@gmail.com', // list of receivers
                  subject: 'Node Contact Request', // Subject line
                  text: 'Hello world?', // plain text body
                
              };
            
              // // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);   
                  console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
            
                  res.render('login', {msg:'Email has been sent'});
              });
              
                      
                      // const { MailtrapClient } = require("mailtrap");
                      // // For this example to work, you need to set up a sending domain,
                      // // and obtain a token that is authorized to send from the domain
                      // const TOKEN = "b77e627d33e4ea2719acfc75044b8066";
                      // const SENDER_EMAIL = "info@techlinktechnologies.com";
                      // const RECIPIENT_EMAIL = "abinet22@gmail.com";
                      // const client = new MailtrapClient({ token: TOKEN });
                      // const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };
                      // client
                      //   .send({
                      //     from: sender,
                      //     to: [{ email: RECIPIENT_EMAIL }],
                      //     subject: "Hello from Mailtrap!",
                      //     text: "Welcome to Mailtrap Sending!",
                      //   })
                      //   .then(console.log, console.error);
                    
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
