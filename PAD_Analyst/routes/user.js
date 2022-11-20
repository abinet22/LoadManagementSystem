const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const ApplicantProfile = db.applicantprofiles;
const fs = require('fs');
const path =require('path');
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const upload = require('../middleware/upload.js');
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/addprofile', ensureAuthenticated,async function (req, res) {
  res.render('addprofile',{user:req.user})
});
router.get('/updatepassword', ensureAuthenticated,async function (req, res) {
  res.render('updatepassword',{user:req.user})
});

router.get('/addsystemuser', ensureAuthenticated, async function(req, res){

res.render('addsystemuser',{user:req.user})
});

router.get('/systemuserlist', ensureAuthenticated, async function(req, res){

  const systemuser = await SystemUser.findAll({});
  res.render('allsystemuserlist',{user:req.user,systemuser:systemuser})
  });
  
  router.post('/updatepassword', ensureAuthenticated, async function(req, res){

    const{oldpassword,newpassword,repassword}  =req.body;
    if(!oldpassword || !newpassword || !repassword){
      res.render('updatepassword',{user:req.user,error_msg:'Please Add All Required Fields'})
         
    }
    if(newpassword != repassword){
      res.render('updatepassword',{user:req.user,error_msg:'New Password Not Match With Retype Password'})
                
    }
    else{
      SystemUser.findOne({where:{userid:req.user.userid}}).then((user)=>{
        if(user){
          bcrypt.compare(oldpassword, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              bcrypt.hash(newpassword, 10, (err, hash) => {
                var updatepassword = hash;
                SystemUser.update({password:updatepassword},{where:{userid:req.user.userid}}).then(()=>{
                  res.render('login',{success_msg:'Update Password Successfully Please Login'})
                
                })
      
                }); // 
             
            
            } else {
              req.flash('error_msg', 'Cant Update Wrong Password');
              res.redirect('/logout')
            }
          });
         
        }else{
          req.flash('error_msg', 'Cant Update Wrong User ');
          res.redirect('/logout')
        }
      })
    }
  
  
  });
  

module.exports = router;
