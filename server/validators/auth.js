const { check } = require("express-validator");

const validateUserRegistration = [
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .notEmpty()
    .withMessage("Password field is required"),
];

const validateloginUser = [
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 char long")
    .notEmpty()
    .withMessage("Password is required"),
];

const validateAuthenticateUser = [
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),

  check("otp")
    .isLength({ min: 4, max: 4 })
    .withMessage("otp should be 4 characters long")
    .notEmpty()
    .withMessage("otp is required to authenticate your account"),
];

const validateResetPasswordUser = [
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),
];

const validateResetOtp = [
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),

  check("otp")
    .isLength({ min: 4, max: 4 })
    .withMessage("otp should be 4 characters long")
    .notEmpty()
    .withMessage("otp is required to authenticate your account"),
];

const validateResetPassword = [
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),

  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 char long")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  validateUserRegistration,
  validateloginUser,
  validateAuthenticateUser,
  validateResetPasswordUser,
  validateResetOtp,
  validateResetPassword,
};
