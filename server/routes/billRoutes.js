const express = require("express")
const { initializeBillPayment, verifyPayment } = require("../controllers")
const isAuth = require("../middlewares/isAuth")

const billRouter = express.Router()


billRouter.post("/init-bill", isAuth, initializeBillPayment)
billRouter.get("/verify-payment/:rrr", isAuth, verifyPayment)


module.exports = billRouter