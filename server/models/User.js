const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

     

    firstName : {
        type : String,
        default : ""
    },

    middleName : {
        type : String,
        default : ""
    },

    lastName : {
        type : String,
        default : ""
    },

    email : {
        type : String,
        unique : true,
        default : null
    },

    password : {
        type : String,
        required : true
    },

    dateOfBirth : {
        type : Date,
        default : ""
    },

    occupation : {
        type : String,
        default : ""
    },

    gender : {
        type : String,
        default : ""
    },

    nin : {
        type : Number,
        default : ""
    },

    phone : {
        type : Number,
        required : true,
        unique : true
    },

    address : {
        type : String,
        default : ""
    },

    city : {
        type : String,
        default : ""
    },

    lga : {
        type : String,
        default : ""
    },
    
    image : {
        type : String,
        default : ""
    },

    isUserVerified : {
       type : Boolean,
       default : false
    },

    verifyOtp : {
        type : String,
        default : ""
    },


    verifyOtpExpires : {
        type : Number,
        default : 0
    },

    resetPasswordOtp : {
        type : String,
        default : ""
    },

    resetPasswordOtpExpires : {
        type : Number,
        default : 0
    },

    isProfileComplete : {
        type : Boolean,
        default : false
    },

    authProvider : {
        type : String,
        enum : ["Local", "Google", "Apple", "Yahoo"],
        default : "Local"
    }



}, {timestamps : true, minimize : false})


const User = mongoose.model("User", userSchema)

module.exports = User