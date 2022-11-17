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
router.get('/addsystemuser', ensureAuthenticated, async function(req, res){

res.render('addsystemuser',{user:req.user})
});

router.get('/systemuserlist', ensureAuthenticated, async function(req, res){

  const systemuser = await SystemUser.findAll({});
  res.render('allsystemuserlist',{user:req.user,systemuser:systemuser})
  });
  
router.post('/addnewsystemuser', ensureAuthenticated,async function (req, res, next) {

    const {email,phonenumber,password,userroll,fullname} = req.body;
   
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
    phonenumber:phonenumber,
    isactive:"Yes",
    fullname:fullname,
    userroll:userroll
    }
  
   
    if (errors.length > 0) {
        res.render('addsystemuser', {
            errors,
           userData
        });
    } else {
  
     
      SystemUser.findOne({
        where: {
          email: email
        }
    }).then(user => {
      //console.log(user);
      console.log(user);
            if (!user) {
                bcrypt.hash(password, 10, (err, hash) => {
                userData.password = hash;
  
  
                SystemUser.create(userData)
                    .then(data => {
                      res.render('addsystemuser',{user:req.user,success_msg:'Successfully Created'})
                    }).catch(err => {
                     
                    }) // end of then catch for create method
                }); // 
            } else {
              res.render('addsystemuser',{user:req.user,error_msg:'Email Already Registered'})
                  
            }
        }).catch(err => {
            res.send('ERROR: ' + err)
        }); // end of then catch for findOne method 
  
  
   
    }
  
   
  }) 


module.exports = router;
