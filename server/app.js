const express = require("express")
const dotenv = require("dotenv")
dotenv.config()

const cors = require("cors")
const morgan = require("morgan")
const connectDB = require("./init")
const { notFound } = require("./controllers")
const errorMiddleware = require("./middlewares")


const app = express()
connectDB()

app.use(cors())
app.use(morgan("dev"))
app.use(notFound)

app.get("/", (req, res) => res.send("<p> API WORKING </p>"))

app.use(errorMiddleware)

exports.app = app


