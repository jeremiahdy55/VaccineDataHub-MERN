const express = require("express");
const vaccineRouter = express.Router({ strict: true, caseSensitive: true });
const VaccineModel = require("../models/vaccineModel");
const { isAuthorized } = require("../jwtauth/JWTAuth");

vaccineRouter.get("/getVaccines", async (req, res) => {
  try {
    const vaccines = await VaccineModel.find().lean(); // return simple JSON object
    res.status(200).json({vaccines});
  } catch (err) {
    res.status(500).send("Error retrieving vaccines");
  }
});

// use authenticateToken as middleware to ensure user is authenticated
vaccineRouter.post("/registerVaccine", isAuthorized, async (req,res) => {
  const vaccineObj = req.body;
  try {
    const vaxToSave = new VaccineModel(vaccineObj);
    await vaxToSave.save();
    const vaccines = await VaccineModel.find().lean(); // return simple JSON object
    res.status(201).json({vaccines});
  } catch (err) {
    console.log(err);

    if (err.name === "MongoServerError" && err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        error: "Duplicate entry for a unique field",
        field: Object.keys(err.keyValue)[0],
        value: err.keyValue[Object.keys(err.keyValue)[0]],
      });
    }

    if (err.name === "ValidationError") {
      // Mongoose validation error
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }

    return res.status(500).send("Error inserting vaccine");
  }
});

module.exports = vaccineRouter;
