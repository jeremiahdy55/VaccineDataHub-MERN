require("dotenv").config(); // inject environment variables from .env
const express = require('express')
const cors = require("cors")

const app = express() // creates an express application to build a web server
globalThis.rootPath = __dirname

//allowing the cross origin resource sharing
app.use(cors())

//json middle-ware for setting request content type to json in body
app.use(express.json({limit:'2mb', extended:false}))

// route declarations
const hospitalRouter = require("./routes/hospitalRoute")
const vaccineRouter = require("./routes/vaccineRoute")
const userRouter = require("./routes/userRoute")
// const scheduledVaccines = require("")

// assign endpoint bases to routers
app.use("/user", userRouter)
app.use("/api/hospital", hospitalRouter)
app.use("/api/vaccine", vaccineRouter)

console.log("VaccineDataHub REST-API is listening at port:9000")
app.listen(9000)
