const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.users;
const SystemUser = db.systemusers;
const LoanSector = db.loansector;
const LoanSubSector = db.loansubsector;
const LoanApplication  = db.loanapplications;
const CADReview = db.cadreviews;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/allnewapplicationlist', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status ='New'"
  );
  res.render('allapplicationlist',{user:req.user,application:application})
} );

router.get('/activeapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where  loanapplications.application_status !='New'"
  );
  const cadreview = await CADReview.findAll({where:{applicantid:req.user.userid}});
  res.render('allapplicationlist',{user:req.user,application:application,
    tag:"Active",cadreview:cadreview})
} );
router.get('/selectedapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where  loanapplications.application_status='Approved'"
  );
  res.render('allapplicationlist',{user:req.user,application:application})
} );
router.get('/rejectedapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status='Rejected'"
  );
  res.render('allapplicationlist',{user:req.user,application:application})
} );

module.exports = router;
