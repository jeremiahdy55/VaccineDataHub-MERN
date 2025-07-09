const express = require("express");
const demographicDataRouter = express.Router({ strict: true, caseSensitive: true });
const DemographicDataModel = require("../models/demographicDataModel");

// Get all demographic data
demographicDataRouter.get("/getDemographicData",  async (req, res) => {
  try {
    const demoData = await DemographicDataModel.find().lean(); // return simple JSON object
    res.status(201).json(demoData);
  } catch (err) {
    res.status(500).send("Error retrieving demographic data");
  }
});

// filter demographic data based on filter object
demographicDataRouter.post("/getDemographicData", async (req, res) => {
  let {
    ageMin,
    ageMax,
    genders,
    professions,
    medicalHistoryTerms,
    ethnicities,
  } = req.body;


  /// Construct the filter object
  const filter = {};

  // age, NOTE: create filter.age object ONCE (using only one conditional)
  if (ageMin !== undefined || ageMax !== undefined) {
    filter.age = {};
    if (ageMin !== undefined) filter.age.$gte = ageMin;
    if (ageMax !== undefined) filter.age.$lte = ageMax;
  }

  // gender
  if (Array.isArray(genders) && genders.length > 0) {
    filter.gender = { $in: genders };
  }

  // ethnicity
  if (Array.isArray(ethnicities) && ethnicities.length > 0) {
    filter.ethnicity = { $in: ethnicities };
  }

  // profession
  if (Array.isArray(professions) && professions.length > 0) {
    filter.profession = { $in: professions }; // ✅ correct key: singular
  }

  // medicalHistory
  if (Array.isArray(medicalHistoryTerms) && medicalHistoryTerms.length > 0) {
    filter.medicalHistory = { $in: medicalHistoryTerms };
  }


  // find all data that fits the filter that was passed
  try {
    const demoData = await DemographicDataModel.find(filter).lean(); // return simple JSON object, not Mongo Obj
    res.status(201).json(demoData);
  } catch (err) {
    res.status(500).send("Error retrieving demographic data");
  }
});

module.exports = demographicDataRouter;
