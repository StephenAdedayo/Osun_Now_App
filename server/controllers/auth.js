const axios = require("axios")
const { TWILIO_PHONE, TERMII_SENDER, TERMII_API_KEY } = require("../config/keys")
const { User } = require("../models")
const comparePassword = require("../utils/comparePassword")
const generateCode = require("../utils/generateCode")
const generateToken = require("../utils/generateToken")
const hashPassword = require("../utils/hashPassword")
const twilioClient = require("../utils/twilio")

const registerUser = async (req, res, next) => {

    try {
        
        const {phone, password} = req.body

       
        const phoneExists = await User.findOne({phone})

        if(phoneExists){
            res.code = 400
            throw new Error("User already exists")
        }

        const hashedPassword = await hashPassword(password)

        const userDetails = {
            phone  : +phone,
            password : hashedPassword
        }

        const newUser = new User(userDetails)
        await newUser.save()


        res.status(201).json({success : true, message : "User registration successful", newUser})
    } catch (error) {
        next(error)
    }

}


const loginUser = async (req, res, next) => {

    try {

        const {phone, password} = req.body

        const user = await User.findOne({phone})

        if(!user){
            res.code = 400
            throw new Error("User does not exists, please register")
        }

        const isMatch = await comparePassword(password, user.password)

        if(!isMatch){
            res.code = 400
            throw new Error("Password does not match")
        }

        const token = generateToken(user)

        if(user.isUserVerified){
           return res.status(200).json({success : true, message : "Login successful", token})
        }

       const otp = generateCode(4)
        
       user.verifyOtp = otp
       user.verifyOtpExpires = Date.now() + 24 * 60 * 60 * 1000

       await user.save()

      await twilioClient.messages.create({
      body: `Your OTP is ${otp}. Expires in 5 minutes.`,
      from: TWILIO_PHONE,
      to: `+234${user.phone}`,
  });  

//   console.log(`+234${user.phone}`);
  
  
//   await axios.post("https://v3.api.termii.com/api/sms/send", {
//       to: `+234${user.phone}`,
//       from: TERMII_SENDER,
//       sms: `Your OTP is ${otp}. Expires in 5 minutes.`,
//       type: "plain",
//       channel: "generic",
//       api_key: TERMII_API_KEY,
//     });

  res.status(200).json({success : true, message : "Enter otp sent to verify your account", otp})

    } catch (error) {
        next(error)
    }

}


const authenticateUser = async (req, res, next) => {


    try {
        const {phone, otp} = req.body

        const user = await User.findOne({phone})

        if(!user){
            res.code = 400
            throw new Error("User not found")
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            res.code = 400
            throw new Error("Invalid otp")
        }

        if(user.verifyOtpExpires < Date.now()){
            res.code = 400
            throw new Error("Otp already expired")
        }

        user.isUserVerified = true
        user.verifyOtp = null
        user.verifyOtpExpires = 0

        await user.save()

        const token = generateToken(user)

        res.status(200).json({success: true, message : "User verified successfully", token})

    } catch (error) {
        next(error)
    }

}

const sendResetPasswordOtp = async (req, res, next) => {

    try {
        const {phone} = req.body

        const user = await User.findOne({phone})

        if(!user){
            res.code = 400
            throw new Error("User not found")
        }


        const otp = generateCode(4)

        user.resetPasswordOtp = otp
        user.resetPasswordOtpExpires = Date.now() + 24 * 60 * 60 * 1000

        await user.save()
         
      await twilioClient.messages.create({
      body: `Your OTP is ${otp}. Expires in 5 minutes.`,
      from: TWILIO_PHONE,
      to: `+234${user.phone}`,
     });  

    res.status(200).json({success : true, otp, message : "Reset password otp sent successfuly"})

    } catch (error) {
        next(error)
    }

}

const verifyResetOtp = async (req, res, next) => {

    try {
        const {phone, otp} = req.body

        const user = await User.findOne({phone})

        if(!user){
            res.code = 400
            throw new Error("User not found")
        }

       if(user.resetPasswordOtp === "" || user.resetPasswordOtp !== otp){
            res.code = 400
            throw new Error("Invalid otp")
        }

        if(user.resetPasswordOtpExpires < Date.now()){
            res.code = 400
            throw new Error("Otp already expired")
        }

        user.resetPasswordOtp = null,
        user.resetPasswordOtpExpires = 0  

        await user.save()
        
        res.status(200).json({success : true, message : "Otp verification successful"})

    } catch (error) {
        next(error)
    }

}


const resetPasswordUser = async (req, res, next) => {

    try {
        const {phone, newPassword} = req.body

        const user = await User.findOne({phone})

        if(!user){
            res.code = 400
            throw new Error("User not found")
        }

        const hashedPassword = await hashPassword(newPassword)
        user.password = hashedPassword,
        
        await user.save()

        res.status(200).json({success : true, message : "Password reset successful"})
    } catch (error) {
        next(error)
    }

}



module.exports = {registerUser, loginUser, authenticateUser, sendResetPasswordOtp, verifyResetOtp, resetPasswordUser}