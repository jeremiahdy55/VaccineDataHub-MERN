import dotenv from "dotenv";
dotenv.config(); // inject environment variables from .env

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express, { json } from 'express';
import cors from "cors";
import { connect } from "mongoose";

const app = express() // creates an express application to build a web server
globalThis.rootPath = __dirname

//allowing the cross origin resource sharing
app.use(cors({
    origin: "http://localhost:9090", // frontend URL
    credentials: true,
    exposedHeaders: ["x-access-token"] // used for JWT token issuing and refresh
  }));

//json middle-ware for setting request content type to json in body
app.use(json({limit:'2mb', extended:false}))

// connect to localmachine MongoDB and create/use a database with name: {vaccinedatahub}
connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// route declarations
import userRouter from "./routesAuth/userRoute.js";
import hospitalRouter from "./routesAPI/hospitalRoute.js";
import vaccineRouter from "./routesAPI/vaccineRoute.js";
import appointmentRouter from "./routesAPI/appointmentRoute.js";
import demographicDataRouter from "./routesAPI/demographicDataRoute.js";

// assign endpoint bases to routers
app.use("/user", userRouter)
app.use("/api/hospital", hospitalRouter)
app.use("/api/vaccine", vaccineRouter)
app.use("/api/appointment", appointmentRouter)
app.use("/api/demographicData", demographicDataRouter)

console.log("VaccineDataHub REST-API is listening at port:9000")
app.listen(9000)
