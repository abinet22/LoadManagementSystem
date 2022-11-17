const express = require('express');
const router = express.Router();

const fs = require('fs');
const path =require('path');
const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const LoanSector = db.loansector;
const LoanSubSector = db.loansubsector;
const LoanApplication  = db.loanapplications;
const ApplicantProfile  = db.applicantprofiles;
const CADReview  = db.cadreviews;


const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/allnotifications', ensureAuthenticated,async function (req, res) {
  const [cadreview, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM cadreviews inner join systemusers on "+ 
    " cadreviews.reviewedby = systemusers.userid inner join loanapplications on "+
    " loanapplications.appid = cadreviews.applicationid "+
    " where cadreviews.applicantid = '"+req.user.userid+"'");
  res.render('allreviews',{user:req.user,cadreview:cadreview,tag:"Notread"})
});
router.get('/notreadnotifications', ensureAuthenticated,async function (req, res) {
  const [cadreview, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM cadreviews inner join systemusers on "+ 
    " cadreviews.reviewedby = systemusers.userid inner join loanapplications on "+
    " loanapplications.appid = cadreviews.applicationid "+
    " where isread='No' and cadreviews.applicantid = '"+req.user.userid+"'");
  res.render('allreviews',{user:req.user,cadreview:cadreview,tag:"Notread"})
});
router.get('/readnotifications', ensureAuthenticated,async function (req, res) {
  const [cadreview, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM cadreviews inner join systemusers on "+ 
    " cadreviews.reviewedby = systemusers.userid inner join loanapplications on "+
    " loanapplications.appid = cadreviews.applicationid "+
    " where isread='Yes' and cadreviews.applicantid = '"+req.user.userid+"'");
  res.render('allreviews',{user:req.user,cadreview:cadreview,tag:""})
});

module.exports = router;
