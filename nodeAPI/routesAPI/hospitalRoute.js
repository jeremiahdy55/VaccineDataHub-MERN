const express = require("express");
const hospitalRouter = express.Router({ strict: true, caseSensitive: true });
const HospitalModel = require("../models/hospitalModel");
const { isAuthorized } = require("../jwtauth/JWTAuth");

// use isAuthorized as middleware to ensure user is authenticated
hospitalRouter.get("/getHospitals", isAuthorized, async (req, res) => {
  try {
    const hospitals = await HospitalModel.find().lean(); // return simple JSON object
    res.status(201).json(hospitals);
  } catch (err) {
    res.status(500).send("Error retrieving hospitals");
  }
});

module.exports = hospitalRouter;
