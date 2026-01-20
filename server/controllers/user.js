const { User } = require("../models")
const cloudinary = require("cloudinary").v2

const setUpUserAccount = async (req, res, next) => {


    try {
        const {firstName, middleName, lastName, dateOfBirth, occupation, gender, nin, phone, email, address, city, lga} = req.body

        const imageFile = req.file

        const userId = req.user._id

        const user = await User.findById(userId)

        if(!user){ 
            res.code = 400
            throw new Error("User not found")
        }

        if(email){
         const emailExists = await User.findOne({email})
           if(emailExists){
            res.code = 400
            throw new Error("Email already exists")
           }
        }

        const uploadUrl = await cloudinary.uploader.upload(imageFile.path)
       
        user.image = uploadUrl.secure_url
        
        
        user.firstName = firstName
        user.middleName = middleName
        user.lastName = lastName
        user.dateOfBirth = dateOfBirth
        user.occupation = occupation
        user.gender = gender
        user.nin = +nin
        user.phone = +phone
        user.email = email
        user.address = address
        user.city = city
        user.lga = lga
        user.isProfileComplete = true


        await user.save()

       res.status(200).json({success : true, message: "Account Set up successful"})

    } catch (error) {
       next(error)
    }

}


const getUserData = async (req, res, next) => {

    try {
        const {_id} = req.user

        const user = await User.findById(_id).select("-password -verifyOtp -verifyOtpExpires -resetPasswordOtp -resetPasswordOtpExpires")

        if(!user){
            res.code = 400
            throw new Error("User data not found")
        }

        res.status(200).json({success : true, user})


    } catch (error) {
        next(error)
    }

}


module.exports = {setUpUserAccount, getUserData}
