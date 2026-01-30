const { check } = require("express-validator");

const validateSetUpUser = [
  check("firstName").notEmpty().withMessage("FirstName is required"),
  check("middleName").notEmpty().withMessage("MiddleName is required"),
  check("lastName").notEmpty().withMessage("LastName is required"),
  check("dateOfBirth").notEmpty().withMessage("Date of birth is required"),
  check("occupation").notEmpty().withMessage("Occupation is required"),
  check("gender").notEmpty().withMessage("Gender is required"),
  check("nin")
    .isLength({ min: 11, max: 11 })
    .withMessage("NIN should be 11 characters long")
    .notEmpty()
    .withMessage("NIN is required"),
  check("phone")
    .isMobilePhone()
    .withMessage("Invalid phone")
    .notEmpty()
    .withMessage("Phone is required to check if account is verified"),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .notEmpty()
    .withMessage("Email is required"),
  check("address").notEmpty().withMessage("Address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("lga").notEmpty().withMessage("LGA is required"),
];

module.exports = { validateSetUpUser };
