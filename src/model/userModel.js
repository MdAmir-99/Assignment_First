const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    password: {type:String, required:true}, // encrypted password
    confirmPassword: {type:String, required:true}, // encrypted password
    email: {type:String, required:true, unique:true},
    phone: {type:String, required:true, unique:true}, 
    profileImage: {type:String, required:true}, // s3 link
}, {timestamps:true})

userSchema.pre('save', function(){
    this.confirmPassword = undefined
})  

module.exports = mongoose.model("user",userSchema)