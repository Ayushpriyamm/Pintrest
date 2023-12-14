const multer = require('multer');
const{v4 : uuidv4} =require('uuid');
const path= require('path')

const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,'./public/images/uploads') //destinamtion of image uoload 
    },
    filename:function (req,file,cb) {
        const uniqueFilename=uuidv4();
        cb(null,uniqueFilename+path.extname(file.originalname));  //to extract extension of uploaded image  
    }
});

const upload =multer({storage:storage});

module.exports=upload;