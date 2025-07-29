import { Schema, model } from "mongoose";
const schemaObj = Schema;

const appointmentSchema = new schemaObj(
  {
    appointmentDate: { type: Date, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "hospital",
      required: true,
    },
    vaccineId: {
      type: Schema.Types.ObjectId,
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
const AppointmentModel = model("appointment", appointmentSchema); 
export default AppointmentModel;
