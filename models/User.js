const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const UserModel = new Schema({
    name:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true,
        validate:{
            validator:function (e) {
                return validator.isMobilePhone(e);
              }
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function (e)
            {
                return validator.isEmail(e);
            }
        }
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    }
})

const User = mongoose.model("User",UserModel);
module.exports = User;