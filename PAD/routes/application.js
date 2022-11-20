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
const AnalystWork = db.analystworks;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/newapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status='Approve_And_Sent_To_PAD'"
  );
  res.render('allapplicationlist',{user:req.user,application:application,cadreview:'',tag:'New'})
} );

router.get('/activeapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid  "+
    
     " where  loanapplications.application_status ='Approve_And_Sent_To_CRMD_Analyst'"
  );
  const cadreview = await CADReview.findAll({where:{reviewedby:req.user.userid}});
  res.render('allapplicationlist',{user:req.user,application:application,tag:"Active",cadreview:cadreview})
} );
router.get('/selectedapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where  loanapplications.application_status='Approved'"
  );
  res.render('allapplicationlist',{user:req.user,application:application,cadreview:'',tag:'Selected'})
} );
router.get('/rejectedapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.applicant_id ='"+req.user.userid+"' and loanapplications.application_status='Rejected'"
  );
  res.render('allapplicationlist',{user:req.user,application:application,cadreview:'',tag:'Rejected'})
} );
router.get('/showsingleapplicantdocument/(:appid)', ensureAuthenticated, async function(req, res) {
  
   const systemusers = await SystemUser.findAll({where:{userroll:'PAD_Analyst'}});
   const [reviews, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM cadreviews INNER JOIN systemusers on "+
    " cadreviews.reviewedby = systemusers.userid where cadreviews.applicationid ='"+req.params.appid+"'"
     );
  LoanApplication.findOne({where:{appid:req.params.appid}}).then((applications)=>{
   
    ApplicantProfile.findOne({where:{applicant_id:applications.applicant_id}}).then((profile)=>{

      res.render('singleaplicationdata',{reviews:reviews,systemusers:systemusers,user:req.user,singleappdoc:applications,profile:profile,appid:applications.appid})
    })

   })
 
});
router.post('/updatestatus/(:applicantid)/(:appid)', ensureAuthenticated, async function(req, res) {
  const{analyst} = req.body;
  const errors = [];
  const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  jobid = uuidv4(v1options);
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status='New'"
  );
  if(!analyst){

  }else{
    const analystword = {
      jobid:jobid,
    applicationid:req.params.appid,
    analystid:analyst
 
    }
  AnalystWork .create(analystword).then(analyst =>{
    LoanApplication.findOne({where:{appid:req.params.appid}}).then((applications)=>{
      LoanApplication.update({application_status:'Approve_And_Sent_To_PAD_Analyst'},{where:{appid:req.params.appid}}).then(()=>{
        res.render('allapplicationlist',{user:req.user,application:application,
          cadreview:'',tag:'New',
          success_msg:'Update Application Status And Job Assigned Successfully'})
      })
    
     })
  }).catch(err =>{
    res.render('allapplicationlist',{user:req.user,application:application,
      cadreview:'',tag:'New',
      success_msg:'Error While Application Status And Job Assigned'})
   
  })
}

});
module.exports = router;
