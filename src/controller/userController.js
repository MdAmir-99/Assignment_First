const userModel = require("../model/userModel");
const validator = require("../validation");
const {uploadFile} = require('../aws/uploadFile')
const dotenv = require("dotenv");
const CryptoJS = require("crypto-js");

dotenv.config({ path: "./config.env" });

const createUser = async function (req, res) {
  try {
    let requestBody = req.body;
    let { name, password, confirmPassword , email , phone} = requestBody;
    let profileImage = req.files;

    // <----------BODY VALIDATION------------->
    if (!validator.isValidRequestBody(requestBody))
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide user details",
      });

    // <----------profleImage Validation--------------->

    if(profileImage.length == 0)
      return res.status(400).send({ status: false, message: "profileImage is required"})

      if (profileImage && profileImage.length > 0) {
        if (profileImage[0].mimetype == "image/jpeg" || profileImage[0].mimetype == "image/jpg"
            || profileImage[0].mimetype == "image/png") {
            const uploaded = await uploadFile(profileImage[0]);
            profileImage = uploaded;
            requestBody['profileImage'] = profileImage;
        }
        else {
            return res.status(400).send({ status: false, message: "Profile image should be in jpg, jpeg or png format !!" });
        }
    }  

    // <-------------NAME VALIDATION------------>
    if (!validator.isValidField(name))
      return res
        .status(400)
        .send({ status: false, message: "name is required" });

    if (!validator.isValidName(name))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid name " });

        // <---------PASSWORD VALIDATION------------>
        if (!validator.isValidField(password))
          return res
            .status(400)
            .send({ status: false, message: "password is required" });
    
        if (!validator.isValidPassword(password))
          return res.status(400).send({
            status: false,
            message: "password should contain atleast 1 letter & 1 number",
          });
    
        // <---------Confirm PASSWORD VALIDATION------------>
        if (!validator.isValidField(confirmPassword))
          return res
            .status(400)
            .send({ status: false, message: "password is required" });
    
        if (!validator.isValidPassword(confirmPassword))
          return res.status(400).send({
            status: false,
            message: "password should contain atleast 1 letter & 1 number",
          });
    
        // password or Confirm password is same or not and Encryption
        if (password !== confirmPassword)
          return res
            .status(400)
            .send({
              status: false,
              message: "Password & Confirm password is not matched !",
            });
    
        let encPassword = CryptoJS.AES.encrypt(
          password,
          process.env.PASSWORD_ENC_SEC_KEY
        ).toString();
        requestBody.password = encPassword;

    // <------------PHONE VALIDATION------------>
    if (!validator.isValidField(phone))
      return res
        .status(400)
        .send({ status: false, message: "phone number is required" });

    if (!validator.isValidMobile(phone))
      return res
        .status(400)
        .send({ status: false, message: `${phone} is not valid` });

    // <----------Check Phone no. is Exist in Db or not------------->
    const isphoneAlreadyUsed = await userModel.findOne({ phone });
    if (isphoneAlreadyUsed)
      return res.status(400).send({
        status: false,
        message: `${phone} phone no. is already registered`,
      });

    // <------------EMAIL VALIDATION--------------->
    if (!validator.isValidField(email))
      return res
        .status(400)
        .send({ status: false, message: "email is required" });

    if (!validator.isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: `${email} is not valid email` });

    // <----------Check Email is Exist in Db or not------------->
    const isEmailAlreadyUsed = await userModel.findOne({ email });
    if (isEmailAlreadyUsed)
      return res.status(400).send({
        status: false,
        message: `${email} email is already registered`,
      });

    let userSaved = await userModel.create(requestBody);
    return res.status(201).send({
      status: true,
      message: "user successfully created",
      data: userSaved,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

// *************Login USer*************
const loginUser = async function (req, res) {
    try {
      let requestBody = req.body;
      let { email, password } = requestBody;
  
      // <-----------Check Email && Password Exist in reqBody------------>
      if (!email) {
        return res
          .status(400)
          .send({ status: false, message: "Email is required!" });
      }
      if (!password) {
        return res
          .status(400)
          .send({ status: false, message: "Password is required!" });
      }
  
      // <---------Validation for Email------------>
      if (!validator.isValidEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Email is not valid" });
      }
  
      // <------------Validation for Password----------->
      if (!validator.isValidPassword(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Password is not valid" });
      }
  
      // <----------Check User Email exist in db or not with login crediential------------>
      let validUser = await userModel.findOne({ email }).lean();
  
      if (!validUser) {
        return res
          .status(401)
          .send({ status: false, message: "Email or Password is not correct" });
      }
      // <--------------Password Decryption--------------->
      const decryptPassword = CryptoJS.AES.decrypt(
        validUser.password,
        process.env.PASSWORD_ENC_SEC_KEY
      );
      const confirmPass = decryptPassword.toString(CryptoJS.enc.Utf8);
  
      if (password !== confirmPass)
        return res
          .status(400)
          .send({ status: false, message: "email or password is incorrect" });
  
      return res.status(200).send({
        status: true,
        message: "user logged in successfully",
        data: validUser
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }

  module.exports = {createUser, loginUser}