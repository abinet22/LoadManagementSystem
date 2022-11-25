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
const nodeMailer = require('nodemailer');
const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/newapplication', ensureAuthenticated, async function(req, res) {
 
  const [application, allnewapplicationmeta] = await sequelize.query(
   " SELECT * from applicantprofiles inner join loanapplications on " +
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join analystworks on "+
     " analystworks.applicationid = loanapplications.appid   "+
    " where loanapplications.application_status='Approve_And_Sent_To_CRMD_Analyst'"+
    " and analystworks.analystid ='"+req.user.userid+"'"
  );
 
  console.log("apppppppppppppppp")

  res.render('allapplicationlist',{user:req.user,application:application,cadreview:'',tag:'New'})
} );

router.get('/activeapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid  "+
    
     " where  loanapplications.application_status ='Approve_And_Sent_To_PAD'"
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

      res.render('singleaplicationdata',{appid:req.params.appid,user:req.user,singleappdoc:applications,profile:profile,appid:applications.appid})
    })

   })
 
});
router.get('/showreview/(:appid)', ensureAuthenticated, async function(req, res) {

  const [reviews, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM cadreviews INNER JOIN systemusers on "+
    " cadreviews.reviewedby = systemusers.userid where cadreviews.applicationid ='"+req.params.appid+"'"
     );
  LoanApplication.findOne({where:{appid:req.params.appid}}).then((applications)=>{
  
   ApplicantProfile.findOne({where:{applicant_id:applications.applicant_id}}).then((profile)=>{

     res.render('allreviewsingleapplication',{reviews:reviews,user:req.user,singleappdoc:applications,profile:profile,appid:applications.appid})
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
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.application_status='New'"
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
         
            const transporter = nodeMailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              auth: {
                user: 'abinet22@gmail.com',
                pass: 'weihsrnqoubzzpcd',
              },
            });
           
            transporter.verify().then(console.log).catch(console.error);
            User.findOne({where:{userid:req.params.applicantid}}).then((user)=>{
         if(user){
       var useremail= user.email;
        let mailOptions = {
          from: 'abinet22@gmail.com', // sender address
          to: useremail, // list of receivers
          subject: 'update loan application  by crmd analyst', // Subject line
          text: 'your loan application is'+loanstatus
          , // plain text body
        
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
        res.render('allapplicationlist',{user:req.user,application:application,
          cadreview:'',tag:'New',
          success_msg:'Update Application Status Successfully'})
    });
         }
         else{
          res.render('allapplicationlist',{user:req.user,application:application,
            cadreview:'',tag:'New',
            success_msg:'Update Application Status Successfully'})
      
         }
         })
        
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
