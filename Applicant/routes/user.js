const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const ApplicantProfile = db.applicantprofiles;
const fs = require('fs');
const path =require('path');
const sequelize = db.sequelize ;
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");

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
router.post("/addprofile",ensureAuthenticated, upload.single('appid'), async function (req, res){

    try {
    
      const{firstname,middlename,nationality,recommedation,
        region,zoneworeda,citykebelehno,phoneone,education,
        martial,lastname,emergencyname,emergencyphone,
      gender,dob,placeofbirth} = req.body;
      var dobs = new Date(dob);  
      //calculate month difference from current date in time  
      var month_diff = Date.now() - dobs.getTime();  
        
      //convert the calculated difference in date format  
      var age_dt = new Date(month_diff);   
        
      //extract year from date      
      var year = age_dt.getUTCFullYear();  
        
      //now calculate the age of the user  
      var age = Math.abs(year - 1970);  
  
      User.findOne({where:{userid:req.user.userid}}).then(applicant =>{
        if(applicant)
        {
         ApplicantProfile.create({
    
           applicant_id: req.user.userid,
           applicant_f_name: firstname,
           applicant_m_name: middlename,
           applicant_l_name: lastname,
           
           age: age,
           martialstatus:martial,
         gender: gender,
         date_of_birth: dob,
         place_of_birth: placeofbirth,
           education:education,
         nationality: nationality,
         region:region,
         zone_woreda: zoneworeda,
         city_kebele_hno:citykebelehno,
         contact_phone_one: phoneone,
         contact_phone_two: phoneone,
         emergen_name: emergencyname,
         emergency_phone: emergencyphone,
       
           recommedation:recommedation,
       typeid:req.file.mimetype,
       nameid: req.file.filename,
       dataid: fs.readFileSync(
         path.join(__dirname,'../public/uploads/') + req.file.filename
       ),
     
           
         }).then((image) => {
           fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.nameid,
          
             image.dataid
           );
         
           res.render('addprofile',{
            user:req.user,
           
            success_msg:'You Are Successfully Register And Applicant Profile Data!'
            });
          
         });
        }
        else{
          res.render('addprofile',{
            user:req.user,
            
            error_msg:'Applicant With This Id Not Found!'
            });
        }
       }).catch(error =>{
         console.log(error)
        res.render('addprofile',{
          user:req.user,
          
          error_msg:'Applicant With This Id Not Found!'
          });
       })
       
      } catch (error) {
    console.log(error)
      res.render('addprofile',{
        user:req.user,
     
        error_msg:'Error When Trying Upload Images Data Please Try Later!'
      })
       }
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
    User.findOne({where:{userid:req.user.userid}}).then((user)=>{
      if(user){
        bcrypt.compare(oldpassword, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            bcrypt.hash(newpassword, 10, (err, hash) => {
              var updatepassword = hash;
              User.update({password:updatepassword},{where:{userid:req.user.userid}}).then(()=>{
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