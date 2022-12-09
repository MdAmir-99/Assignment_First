const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config({ path: "./config.env" })

aws.config.update({
    accessKeyId: process.env.ACC_ID,
    secretAccessKey: process.env.SEC_ID,
    region: "ap-south-1"
})


let uploadFile= async ( file) =>{
    return new Promise( function(resolve, reject) {
     // this function will upload file to aws and return the link
     let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
 
     var uploadParams= {
         ACL: "public-read",
         Bucket: process.env.BUCKET_NAME,  //HERE
         Key: "abc/" + Date.now()+"-"+file.originalname, //HERE 
         Body: file.buffer
     }
 
 
     s3.upload( uploadParams, function (err, data ){
         if(err) {
             return reject({"error": err})
         }
        //  console.log(data)
         console.log("file uploaded succesfully")
         return resolve(data.Location)
     })
 
    })
 }
 module.exports = {uploadFile};