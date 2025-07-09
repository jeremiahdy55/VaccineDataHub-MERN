const mongoose = require("mongoose");
const schemaObj = mongoose.Schema;

// // connect to localmachine MongoDB and create/use a database with name: {vaccinedatahub}
// mongoose.connect(process.env.MONGO_URI);

const vaccineSchema = new schemaObj(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate vaccine names
      trim: true,
    },
    abbreviation: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate vaccine abbreviation
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "mRNA",
        "Viral Vector",
        "Inactivated",
        "Live Attenuated",
        "Protein Subunit",
        "DNA-Based",
        "Toxoid",
        "Other",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sideEffects: {
      type: [String],
      default: [],
    },
    origin: {
      type: String,
      required: true,
    },
    dosesRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    info: {
      strainsCovered: {
        type: [String],
        default: [],
      },
    },
  },
  {
    versionKey: false,
  }
);

const VaccineModel = mongoose.model("vaccine", vaccineSchema); // MongoDB will pluralize
module.exports = VaccineModel;
