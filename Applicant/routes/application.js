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
const CADReview = db.cadreviews;

const sequelize = db.sequelize ;
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/upload.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/addapplication', ensureAuthenticated, async function(req, res) {
  const loansector = await LoanSector.findAll({});
  const loansubsector = await LoanSubSector.findAll({});
  res.render('addnewapplication',{user:req.user,loansector:loansector,loansubsector:loansubsector})
} );
router.get('/allnewapplicationlist', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.applicant_id ='"+req.user.userid+"'"
  );
  res.render('allapplicationlist',{user:req.user,application:application})
} );

router.get('/activeapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.applicant_id ='"+req.user.userid+"' "
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
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.applicant_id ='"+req.user.userid+"' and loanapplications.application_status='Approved'"
  );
  const cadreview = await CADReview.findAll({where:{applicantid:req.user.userid}});

  res.render('allapplicationlist',{user:req.user,application:application,cadreview:cadreview,tag:"Selected"})
} );
router.get('/rejectedapplication', ensureAuthenticated, async function(req, res) {
  const [application, allnewapplicationmeta] = await sequelize.query(
    "SELECT * FROM loanapplications INNER JOIN applicantprofiles on "+
    " loanapplications.applicant_id = applicantprofiles.applicant_id inner join loansectors on"+
    " loansectors.sectorid  = loanapplications.sector_id inner join loansubsectors on"+
    " loanapplications.subsector_id  = loansubsectors.subsectorid where loanapplications.applicant_id ='"+req.user.userid+"' and loanapplications.application_status='Rejected' "
  );
  const cadreview = await CADReview.findAll({where:{applicantid:req.user.userid}});

  res.render('allapplicationlist',{user:req.user,application:application,cadreview:cadreview,tag:"Rejected"})
} );
router.get('/showsingleapplicantdocument/(:appid)', ensureAuthenticated, async function(req, res) {
  const application= await LoanApplication.findOne({where:{appid:req.params.appid}})
  res.render('singleaplicationdata',{user:req.user,singleappdoc:application})
});

router.post("/addnewapplication",ensureAuthenticated, upload.fields([{ name: 'license', maxCount: 1 },{ name: 'land', maxCount: 1 },{ name: 'vat', maxCount: 1 },, { name: 'bank', maxCount: 1 }, { name: 'merried', maxCount: 1 }, { name: 'latter', maxCount: 1 }]), async function (req, res){
  const loansector = await LoanSector.findAll({});
  const loansubsector = await LoanSubSector.findAll({});
    const{sectorid,subsectorid} = req.body;
    try{
    User.findOne({where:{userid:req.user.userid}}).then(applicant =>{
      if(applicant)
      {
        const v1options = {
          node: [0x01, 0x23],
          clockseq: 0x1234,
          msecs: new Date('2011-11-01').getTime(),
          nsecs: 5678,
        };
        appid = uuidv4(v1options);
       LoanApplication.create({
        applicant_id: req.user.userid,
       appid:appid,
        sector_id: sectorid,
        subsector_id:subsectorid,
        application_status: "New",
       
        typelatter:req.files.latter[0].mimetype,
        namelatter: req.files.latter[0].filename,
        datalatter: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.files.latter[0].filename
        ),
        typelicense: req.files.license[0].mimetype,
        namelicense: req.files.license[0].filename,
        datalicense:fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.files.license[0].filename
        ),
        typeland: req.files.land[0].mimetype,
        nameland: req.files.land[0].filename,
        dataland: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.files.land[0].filename
        ),
        typevat:req.files.vat[0].mimetype,
        namevat:req.files.vat[0].filename,
        datavat:fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.files.vat[0].filename
        ),
        typemerrage:req.files.merried[0].mimetype,
        namemerrage: req.files.merried[0].filename,
        datamerrage: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.files.merried[0].filename
        ),
        typebank:req.files.bank[0].mimetype,
        namebank: req.files.bank[0].filename,
        databank: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.files.bank[0].filename
        )
       }).then((image) => {
        fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.namebank,
           
        image.databank
      );
      fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.nameland,
           
        image.dataland
      );
      fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.namelatter,
           
        image.datalatter
      );
      fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.namelicense,
           
        image.datalicense
      );
      fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.namemerrage,
           
        image.datamerrage
      );
      fs.writeFileSync(path.join(__dirname,'../public/uploads/')+ image.namevat,
           
        image.datavat
      );
       
         res.render('addnewapplication',{
          user:req.user,
         loansector:loansector,
         loansubsector:loansubsector,
          success_msg:'You Are Successfully Register And Application Data!'
          });
        
       });
      }
      else{
        res.render('addnewapplication',{
          user:req.user,
          loansector:loansector,
          loansubsector:loansubsector,
          error_msg:'Applicant With This Id Not Found!'
          });
      }
     }).catch(error =>{
       console.log(error)
      res.render('addnewapplication',{
        user:req.user,
        loansector:loansector,
        loansubsector:loansubsector,
        error_msg:'Applicant With This Id Not Found!'
        });
     })
     
    } catch (error) {
  console.log(error)
    res.render('addnewapplication',{
      user:req.user,
      loansector:loansector,
      loansubsector:loansubsector,
      error_msg:'Error When Trying Upload Images Data Please Try Later!'
    })
     }
});
module.exports = router;
