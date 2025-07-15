const mongoose = require("mongoose");
const schemaObj = mongoose.Schema;

const appointmentSchema = new schemaObj(
  {
    appointmentDate: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hospital",
      required: true,
    },
    vaccineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vaccine",
      required: true,
    },
    approved: { type: Boolean, default: false },
    paid: { type: Boolean, default: false}
  },
  {
    minimize: false,
    versionKey: false, //false - set to false then it wont create in mongodb, don't set it to true, if you want _v just dont add this
  }
);

// Mongo will pluralize
const AppointmentModel = mongoose.model("appointment", appointmentSchema); 
module.exports = AppointmentModel;
