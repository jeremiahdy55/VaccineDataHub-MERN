const mongoose = require("mongoose");
const schemaObj = mongoose.Schema;

// // connect to localmachine MongoDB and create/use a database with name: {vaccinedatahub}
// mongoose.connect(process.env.MONGO_URI);

const hosptialSchema = new schemaObj(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Govt", "Private"],
      default: "Govt",
    },
    serviceCharge: { type: Number, required: true },
  },
  {
    versionKey: false, //false - set to false then it wont create in mongodb, don't set it to true, if you want _v just dont add this
  }
);

const HospitalModel = mongoose.model("hospital", hosptialSchema); // MongoDB will pluralize
module.exports = HospitalModel;
