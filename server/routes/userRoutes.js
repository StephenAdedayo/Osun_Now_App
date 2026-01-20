const express = require("express")
const validate = require("../validators/validate")
const { setUpUserAccount, getUserData } = require("../controllers")
const { validateSetUpUser } = require("../validators/user")
const upload = require("../middlewares/multer")
const isAuth = require("../middlewares/isAuth")


const userRouter = express.Router()


userRouter.post("/setup-account", isAuth, upload.single("image"), validateSetUpUser, validate,   setUpUserAccount)
userRouter.get("/getUserData", isAuth, getUserData)

module.exports = userRouter