require("dotenv").config(); // inject environment variables from .env
const express = require('express')
const cors = require("cors")
const mongoose = require("mongoose");

const app = express() // creates an express application to build a web server
globalThis.rootPath = __dirname

//allowing the cross origin resource sharing
app.use(cors({
    origin: "http://localhost:9090", // frontend URL
    credentials: true,
    exposedHeaders: ["x-access-token"] // used for JWT token issuing and refresh
  }));

//json middle-ware for setting request content type to json in body
app.use(express.json({limit:'2mb', extended:false}))

// connect to localmachine MongoDB and create/use a database with name: {vaccinedatahub}
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// route declarations
const userRouter = require("./routesAuth/userRoute")
const hospitalRouter = require("./routesAPI/hospitalRoute")
const vaccineRouter = require("./routesAPI/vaccineRoute")
const appointmentRouter = require("./routesAPI/appointmentRoute")
const demographicDataRouter = require("./routesAPI/demographicDataRoute")

// assign endpoint bases to routers
app.use("/user", userRouter)
app.use("/api/hospital", hospitalRouter)
app.use("/api/vaccine", vaccineRouter)
app.use("/api/appointment", appointmentRouter)
app.use("/api/demographicData", demographicDataRouter)

console.log("VaccineDataHub REST-API is listening at port:9000")
app.listen(9000)
