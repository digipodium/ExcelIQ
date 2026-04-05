const {Schema, model} = require('../connection');
const mySchema = new Schema({
    name : {type : String, require: true },
    email : {type : String, unique : true },
    password : {type : String, require: true },
    resettoken : {type : String},
    resettokenexpire : {type : Date},
    resetOtp : {type : String},
    otpExpire : {type : Date},
},{timestamps : true});

module.exports = model('users',mySchema);
