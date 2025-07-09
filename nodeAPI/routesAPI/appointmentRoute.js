const express = require("express");
const mongoose = require("mongoose");
const appointmentRouter = express.Router({ strict: true, caseSensitive: true });
const AppointmentModel = require("../models/appointmentModel");
const HospitalModel = require("../models/hospitalModel");
const VaccineModel = require("../models/vaccineModel");
const UserModel = require("../models/userModel");
const { isAuthorized } = require("../jwtauth/JWTAuth");

// create appointment
// approve appointment
appointmentRouter.get(
  "/getPendingAppointments",
  isAuthorized,
  async (req, res) => {
    try {
      const pendingAppointments = await AppointmentModel.find({
        approved: false,
      }).lean(); // return simple JSON object
      return res.status(200).json(pendingAppointments);
    } catch (err) {
      res.status(500).send("Error retrieving pending appointments");
    }
  }
);

appointmentRouter.get(
  "/getUnpaidAppointments/:userId",
  isAuthorized,
  async (req, res) => {
    const filter = { approved: true, paid: false, userId: req.params.userId };
    try {
      const unpaidAppointments = await AppointmentModel.find(filter).lean(); // return simple JSON object
      return res.status(200).json(unpaidAppointments);
    } catch (err) {
      res
        .status(500)
        .send(
          "Error retrieving unpaid appointments for user with _id:" + req.params.userId
        );
    }
  }
);

appointmentRouter.post(
  "/requestAppointment",
  isAuthorized,
  async (req, res) => {
    const appointmentData = req.body;
    try {
      // check if they are valid object id's
      if (!mongoose.Types.ObjectId.isValid(appointmentData.userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }
      if (!mongoose.Types.ObjectId.isValid(appointmentData.vaccineId)) {
        return res.status(400).json({ error: "Invalid vaccineId format" });
      }
      if (!mongoose.Types.ObjectId.isValid(appointmentData.hospitalId)) {
        return res.status(400).json({ error: "Invalid hospitalId format" });
      }
      
      // Check that the vaccine, hospital, and user exists in DB
      const vaccine = await VaccineModel.findById(
        appointmentData.vaccineId
      ).lean();
      if (!vaccine)
        return res.status(404).json({ error: "Invalid vaccineId, not found" });

      const hospital = await HospitalModel.findById(
        appointmentData.hospitalId
      ).lean();
      if (!hospital)
        return res.status(404).json({ error: "Invalid hospitalId, not found" });

      const user = await UserModel.findById(appointmentData.userId).lean();
      if (!user)
        return res.status(404).json({ error: "Invalid userId, not found" });

      // Check if the exact same appointment is trying to be made
      const existing = await AppointmentModel.findOne({
        userId: appointmentData.userId,
        hospitalId: appointmentData.hospitalId,
        vaccineId: appointmentData.vaccineId,
        appointmentDate: appointmentData.appointmentDate,
      });
      if (existing)
        return res.status(409).json({ error: "Appointment already exists" });

      // Create the appointment and save it into MongoDB
      const appointment = new AppointmentModel(appointmentData);
      await appointment.save();
      return res.status(201).json(appointment);
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError") {
        // Mongoose validation error
        return res.status(400).json({
          error: "Validation failed",
          details: err.errors,
        });
      }
      return res.status(500).send("Error in saving appointment");
    }
  }
);

appointmentRouter.post(
  "/approveAppointment/:userId/:appointmentId",
  isAuthorized,
  async (req, res) => {
    try {
      // check if they are valid object id
      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.appointmentId)) {
        return res.status(400).json({ error: "Invalid appointmentId format" });
      }
      // Check that the user exists and has admin privileges in DB
      const user = await UserModel.findById(req.params.userId).lean();
      if (!user)
        return res.status(404).json({ error: "Invalid userId, not found" });
      if (!user.adminPrivilege)
        return res
          .status(403)
          .json({ error: "User does not have administrative privileges" });

      // Try to update the appointment to be approved
      const appointment = await AppointmentModel.findByIdAndUpdate(
        req.params.appointmentId,
        { approved: true },
        { new: true }
      );
      if (!appointment)
        return res
          .status(404)
          .json({
            error: `Could not find appointment with id: ${req.params.appointmentId}`,
          });
      return res.status(200).json(appointment);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error in approving appointment");
    }
  }
);

appointmentRouter.post(
  "/payAppointment/:appointmentId",
  isAuthorized,
  async (req, res) => {
    const appointmentId = req.params.appointmentId;
    try {
      // check if they are valid object id
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ error: "Invalid appointmentId format" });
      }

      // Try to update the appointment to be paid
      const appointment = await AppointmentModel.findById(appointmentId);
      if (!appointment)
        return res
          .status(404)
          .json({
            error: `Could not find appointment with id: ${appointmentId}`,
          });
      if (!appointment.approved)
        return res.status(400).json({ error: "Cannot pay an appointment that is not approved" });
      
      appointment.paid = true;
      await appointment.save();
      return res.status(200).json(appointment);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error in paying appointment");
    }
  }
);

module.exports = appointmentRouter;
