const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const LoanSector = db.loansector;
const LoanSubSector = db.loansubsector;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/addnewsector', ensureAuthenticated,async function (req, res) 
{
  res.render('addnewsector',{user:req.user})
});
router.get('/addnewsubsector', ensureAuthenticated,async function (req, res) 
{
  const sectorlist = await LoanSector.findAll({});
  res.render('addnewsubsector',{user:req.user,sectorlist:sectorlist})
});
router.get('/allsectorlist', ensureAuthenticated,async function (req, res) 
{
  const sectorlist = await LoanSector.findAll({});
  res.render('allsectorlist',{user:req.user,sectorlist:sectorlist})
});
router.get('/allsubsectorlist', ensureAuthenticated,async function (req, res) 
{
  
  const [subsectorlist, subsectorlistmeta] = await sequelize.query(
    "SELECT * FROM loansubsectors INNER JOIN loansectors ON loansubsectors.sectorid = loansectors.sectorid "
  );
  res.render('allsubsectorlist',{user:req.user,subsectorlist:subsectorlist})
});

router.post('/addnewsector', ensureAuthenticated,async function (req, res, next) {

  const {sectorname,sectordesc} = req.body;
 
  const errors = [];
  const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  sectorid = uuidv4(v1options);

  const sectorData = {
  
  sectorid:sectorid,
  secdesc :sectordesc,
  sectorname:sectorname
  }

 
  if (errors.length > 0) {
      res.render('addnewsector', {
          errors,
          user:req.user,
         userData
      });
  } else {

   
    LoanSector.findAll({
      where: {
        sectorname: sectorname
      }
  }).then(user => {
    LoanSector.create(sectorData)
    .then(data => {
      res.render('addnewsector',{success_msg:'Successfully Created',
      user:req.user})
    }).catch(err => {
     
    }) 
   

  })
  }

 
}) 

router.post('/addnewsubsector', ensureAuthenticated,async function (req, res, next) {

  const {subsectorname,subsectordesc,sectorid} = req.body;
 
  const errors = [];
  const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  subsectorid = uuidv4(v1options);

  const subsectorData = {
    subsectorid:subsectorid,
  sectorid:sectorid,
  subsecdesc :subsectordesc,
  subsectorname:subsectorname
  }
  const sectorlist = await LoanSector.findAll({});
 
  if (errors.length > 0) {
      res.render('addnewsector', {
          errors,
         userData,
         user:req.user,
         sectorlist:sectorlist
      });
  } else {

   
    LoanSubSector.findAll({
      where: {
        subsectorname: subsectorname
      }
  }).then(user => {
    LoanSubSector.create(subsectorData)
    .then(data => {
      res.render('addnewsubsector',{success_msg:'Successfully Created',sectorlist:sectorlist,
      user:req.user})
    }).catch(err => {
     
    }) 
   

  })
  }

 
}) 

module.exports = router;
