const { registerUser, loginUser, authenticateUser, sendResetPasswordOtp, resetPasswordUser, verifyResetOtp, googleAuth } = require("./auth");
const { initializeBillPayment, verifyPayment, remitaWebhook } = require("./bill");
const { notFound } = require("./notFound");
const { addService, toggleServiceAvailablity, getServices } = require("./service");
const { setUpUserAccount, getUserData, updateUserProfile } = require("./user");


module.exports = {notFound, registerUser, loginUser, authenticateUser, sendResetPasswordOtp, verifyResetOtp, resetPasswordUser, googleAuth, setUpUserAccount, getUserData, updateUserProfile, addService, toggleServiceAvailablity, getServices, initializeBillPayment, verifyPayment, remitaWebhook}