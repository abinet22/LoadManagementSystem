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


router.get('/newapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status='Approve_And_Sent_To_LRT'"
  );
  res.render('allapplicationlist',{user:req.user,application:application,cadreview:'',tag:'New'})
} );

router.get('/activeapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid  "+
    
     " where  loanapplications.application_status ='Approve_And_Sent_To_LRT'"
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
   LoanApplication.findOne({where:{appid:req.params.appid}}).then((applications)=>{
   
    ApplicantProfile.findOne({where:{applicant_id:applications.applicant_id}}).then((profile)=>{

      res.render('singleaplicationdata',{user:req.user,singleappdoc:applications,profile:profile,appid:applications.appid})
    })

   })
 
});
router.post('/updatestatus/(:applicantid)/(:appid)', ensureAuthenticated, async function(req, res) {
  const{loanstatus,reason} = req.body;
  const errors = [];
  const v1options = {
    node: [0x01, 0x23],
    clockseq: 0x1234,
    msecs: new Date('2011-11-01').getTime(),
    nsecs: 5678,
  };
  reviewid = uuidv4(v1options);
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status='Approve_And_Sent_To_LRT'"
  );
  if(!reason || !loanstatus){

  }else{
    const cadReviewData = {
      reviewid:reviewid,
    reviewedby:req.user.userid,
    applicationid: req.params.appid,
    applicantid:req.params.applicantid,
    reason:reason,
    reviewstatus:loanstatus,
    isread:'No'
    }
    CADReview.create(cadReviewData).then(()=>{
      LoanApplication.findOne({where:{appid:req.params.appid}}).then((applications)=>{
        LoanApplication.update({application_status:loanstatus},{where:{appid:req.params.appid}}).then(()=>{
          res.render('allapplicationlist',{user:req.user,application:application,
            cadreview:'',tag:'New',
            success_msg:'Update Application Status Successfully'})
        })
      
       })
   
    }).catch(err =>{
      console.log(err)
      LoanApplication.findOne({where:{appid:req.params.appid}}).then((applications)=>{
        LoanApplication.update({application_status:loanstatus},{where:{appid:req.params.appid}}).then(()=>{

        })
        ApplicantProfile.findOne({where:{applicant_id:applications.applicant_id}}).then((profile)=>{
    
          res.render('singleaplicationdata',{user:req.user,singleappdoc:applications,profile:profile,appid:applications.appid,
          error_msg:'Please Try Later Something Occurs'
          })
        })
    
       })
    })
  }

});
module.exports = router;
