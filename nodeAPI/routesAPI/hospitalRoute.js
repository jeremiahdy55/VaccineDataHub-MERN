import { Router } from "express";
const hospitalRouter = Router({ strict: true, caseSensitive: true });
import HospitalModel from "../models/hospitalModel.js";
import { isAuthorized } from "../jwtauth/JWTAuth.js";

// use isAuthorized as middleware to ensure user is authenticated
hospitalRouter.get("/getHospitals", isAuthorized, async (req, res) => {
  try {
    const hospitals = await HospitalModel.find().lean(); // return simple JSON object
    res.status(201).json({ hospitals });
  } catch (err) {
    res.status(500).send("Error retrieving hospitals");
  }
});

export default hospitalRouter;
