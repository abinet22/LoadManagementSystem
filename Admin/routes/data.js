const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const CADReview = db.cadreviews;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/alldatachangelogs', ensureAuthenticated, async function(req, res){
  const [cadreview, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM cadreviews inner join systemusers on "+ 
    " cadreviews.reviewedby = systemusers.userid inner join loanapplications on "+
    " loanapplications.appid = cadreviews.applicationid inner join users on"+
    " users.userid = loanapplications.applicant_id"
    );
  res.render('allreviews',{cadreview:cadreview,user:req.user,tag:''})
});

module.exports = router;
