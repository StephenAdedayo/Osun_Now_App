const express = require("express")
const { registerUser, loginUser, authenticateUser, sendResetPasswordOtp, resetPasswordUser, verifyResetOtp } = require("../controllers")
const { validateUserRegistration, validateloginUser, validateAuthenticateUser, validateResetPasswordUser, validateResetPassword, validateResetOtp } = require("../validators/auth")
const validate = require("../validators/validate")


const authRouter = express.Router()


authRouter.post("/sign-up", validateUserRegistration, validate, registerUser)
authRouter.post("/sign-in", validateloginUser, validate, loginUser)
authRouter.post("/verify", validateAuthenticateUser, validate, authenticateUser)
authRouter.post("/send-otp", validateResetPasswordUser, validate, sendResetPasswordOtp)
authRouter.post("/verify-reset-otp", validateResetOtp, validate, verifyResetOtp)
authRouter.post("/reset-password", validateResetPassword, validate, resetPasswordUser)



module.exports = authRouter