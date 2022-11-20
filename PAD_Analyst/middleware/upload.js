const multer = require("multer");
const path = require('path');
const imageFilter = (req, file, cb) => {

  if (file.fieldname === "passport" && file.filename === "") { 
     
  }
  else{
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  }


};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "passport" && file.filename === "") { 
     
    }
    else{
      cb(null, path.join(__dirname,'../public/uploads/'));
    }
   
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "passport" && file.filename === "") { 
     
    }
    else{
      cb(null, `${Date.now()}-LMS-${file.originalname}`);
    }
   
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;