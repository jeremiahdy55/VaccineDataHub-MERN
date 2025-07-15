const mongoose = require("mongoose");
const schemaObj = mongoose.Schema;

// NOTE: static regex expressions are declared between forward-slashes
// /<REGEX EXPRESSION>/

// NOTE: {medicalHistory} field should be editable only by medical staff, but for the sake of this project
//       it will be included in user registration
const demographicSchema = new schemaObj(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      validate: { validator: Number.isInteger },
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Nonbinary", "Other"],
    },
    profession: {
      type: String,
      required: true,
      trim: true,
    },
    medicalHistory: {
      type: [String],
      default: [],
    },
    ethnicity: {
      // similar to U.S. census categories
      type: [String],
      enum: [
        "American Indian or Alaska Native",
        "Asian - East Asian",
        "Asian - South Asian",
        "Asian - Southeast Asian",
        "Black or African American",
        "Hispanic or Latino",
        "Middle Eastern or North African (MENA)",
        "Native Hawaiian or Other Pacific Islander",
        "White",
        "Multiracial or Multiethnic",
        "Other",
        "Prefer not to say",
      ],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

// Force MongoDB to use "demographicData" as the name
const DemographicDataModel = mongoose.model(
  "demographicData",
  demographicSchema,
  "demographicData"
);

module.exports = DemographicDataModel;
