const express = require("express")
const { addService, toggleServiceAvailablity, getServices } = require("../controllers")


const serviceRouter = express.Router()


serviceRouter.post("/add-service", addService)
serviceRouter.post("/toggle-active", toggleServiceAvailablity)
serviceRouter.get("/get-services", getServices)


module.exports = serviceRouter