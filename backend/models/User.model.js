const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpiry:{
        type:Date
    },
    otp:{
        type:Number,
        // required:true
    },
    followers:[{
        type:String,
        default:[]
    }],
    following:[{
        type:String,
        default:[]
    }],
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{timestamps:true})

const User = mongoose.model('User',userSchema)
module.exports = User