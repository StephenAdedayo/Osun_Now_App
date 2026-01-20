const express = require("express")
const dotenv = require("dotenv")
dotenv.config()

const cors = require("cors")
const morgan = require("morgan")
const connectDB = require("./init")
const { notFound } = require("./controllers")
const errorMiddleware = require("./middlewares")
const { authRouter, userRouter } = require("./routes")
const connectCloudinary = require("./utils/cloudinary")
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")



const app = express()

// swagger set up
const swaggerSpec= swaggerJSDoc({
     definition: {
    openapi: "3.0.0",
    info: {
      title: "API Docs",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:8000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },


  apis: ["./docs/*.swagger.js"],
})

connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.use(morgan("dev"))

app.get("/", (req, res) => res.send("<p> API WORKING </p>"))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)

app.use(notFound)

app.use(errorMiddleware)

exports.app = app


