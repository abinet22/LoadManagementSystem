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


router.get('/allreviews', ensureAuthenticated,async function (req, res) {
CADReview.findAll({where:{reviewedby:req.user.userid}}).then((cadreview)=>{
  res.render('allreviews',{user:req.user,cadreview:cadreview})

})
});


module.exports = router;
