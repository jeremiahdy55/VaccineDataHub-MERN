const express = require("express");
const vaccineRouter = express.Router({ strict: true, caseSensitive: true });
const VaccineModel = require("../models/vaccineModel");

// use authenticateToken as middleware to ensure user is authenticated
// hospitalRouter.get("/getHospitals", authenticateToken, async (req, res) => {
vaccineRouter.get("/getVaccines", async (req, res) => {
  try {
    const vaccines = await VaccineModel.find().lean(); // return simple JSON object
    res.json(vaccines);
  } catch (err) {
    res.status(500).send("Error retrieving vaccines");
  }
});

module.exports = vaccineRouter;
