const mongoose = require("mongoose");
const schemaObj = mongoose.Schema;

// connect to localmachine MongoDB and create/use a database with name: {vaccinedatahub}
mongoose.connect(process.env.MONGO_URI);

const scheduledVaccinationSchema = new schemaObj(
  {
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
    appointmentDate: { type: Date, required: true },
  },
  {
    versionKey: false, //false - set to false then it wont create in mongodb, don't set it to true, if you want _v just dont add this
  }
);

const ScheduledVaccinationsModel = mongoose.model("scheduledVaccinations", scheduledVaccinationSchema, "scheduledVaccinations"); // MongoDB will pluralize
module.exports = ScheduledVaccinationsModel;
