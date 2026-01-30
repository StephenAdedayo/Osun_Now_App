const express = require("express")
const { generateBill, userBills, assignBillByOccupation, assignBillToAllUser, getAllBills, getUserBillsAdmin, getSingleUserBill } = require("../../server/controllers")
const { validateBillCreation, validateUserBill, validateMultipleUserBill } = require("../validators/bill")
const validate = require("../../server/validators/validate")
const isAuth = require("../../server/middlewares/isAuth")


const billRouter = express.Router()

billRouter.post("/create-bill", validateBillCreation, validate, generateBill)
billRouter.post("/userBill", validateUserBill, validate, userBills)
billRouter.post("/all-users", validateMultipleUserBill, validate, assignBillToAllUser)
billRouter.post("/create-multiple-user-bills", validateMultipleUserBill, validate, assignBillByOccupation )
billRouter.get("/get-bills", getAllBills)
billRouter.get("/get-bills-admin", getUserBillsAdmin)
billRouter.get("/single-user-bill", isAuth, getSingleUserBill)


module.exports = billRouter

