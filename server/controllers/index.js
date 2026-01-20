const { registerUser, loginUser, authenticateUser, sendResetPasswordOtp, resetPasswordUser, verifyResetOtp } = require("./auth");
const { notFound } = require("./notFound");
const { setUpUserAccount, getUserData } = require("./user");



module.exports = {notFound, registerUser, loginUser, authenticateUser, sendResetPasswordOtp, verifyResetOtp, resetPasswordUser, setUpUserAccount, getUserData}