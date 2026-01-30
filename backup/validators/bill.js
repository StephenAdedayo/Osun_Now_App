const { check } = require("express-validator");
const  mongoose  = require("mongoose");

const validateBillCreation = [

    check("name").notEmpty().withMessage("Bill name is required"),
    check("code").notEmpty().withMessage("Bill code is required e.g WASTE LEVY"),
    check("amount").notEmpty().withMessage("Amount is required"),
    check("frequency").notEmpty().withMessage("Frequency is required"),
    check("appliesTo").notEmpty().withMessage("Applied to is required")

]

const validateUserBill = [

    check("userId").custom(async (userId) => {
        if(userId && !mongoose.Types.ObjectId.isValid(userId)){
            throw `Invalid ID`
        }
    }).notEmpty().withMessage("User cannot be empty"),

    check("billTypeId").custom(async (billTypeId) => {
        if(billTypeId && !mongoose.Types.ObjectId.isValid(billTypeId)){
            throw `Invalid ID`
        }
    }).notEmpty().withMessage("BillType cannot be empty"),


    check("dueDate").isDate().withMessage("Please enter a valid date").notEmpty().withMessage("Due date must not be empty")


]

const validateMultipleUserBill = [

     check("billTypeId").custom(async (billTypeId) => {
        if(billTypeId && !mongoose.Types.ObjectId.isValid(billTypeId)){
            throw `Invalid ID`
        }
    }).notEmpty().withMessage("BillType cannot be empty"),


    check("dueDate").isDate().withMessage("Please enter a valid date").notEmpty().withMessage("Due date must not be empty")

]
module.exports = {validateBillCreation, validateUserBill, validateMultipleUserBill}