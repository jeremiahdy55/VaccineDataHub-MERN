import { Router } from "express";
import { Types } from "mongoose";

import AppointmentModel from "../models/appointmentModel.js";
import HospitalModel from "../models/hospitalModel.js";
import VaccineModel from "../models/vaccineModel.js";
import UserModel from "../models/userModel.js";
import { isAuthorized } from "../jwtauth/JWTAuth.js";
import { generateCompletedAppointmentPDF } from "../pdfgeneration/GenerateCompletedAppointmentPDF.js";

const appointmentRouter = Router({ strict: true, caseSensitive: true });

appointmentRouter.get("/getStrippedAppointments", async (req, res) => {
  try {
    const strippedAppointments = await AppointmentModel.find().select(
      "appointmentDate approved paid vaccineId userId"
    );
    return res.status(200).json({ appointments: strippedAppointments });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error retrieving stripped appointments" });
  }
});

appointmentRouter.get(
  "/getPendingAppointments",
  isAuthorized,
  async (req, res) => {
    try {
      // Check that the user exists and has admin privileges in DB
      const user = await UserModel.findById(req.user.id).lean();
      if (!user)
        return res.status(404).json({ error: "Invalid userId, not found" });
      if (!user.adminPrivilege)
        return res
          .status(403)
          .json({ error: "User does not have administrative privileges" });

      // Get the pending appointments and populate it with the respective data
      const pendingAppointmentsRaw = await AppointmentModel.find({
        approved: false,
      })
        .populate({
          path: "userId",
          select: "-password",
          populate: {
            path: "demographicData",
            model: "demographicData",
          },
        })
        .lean(); // return simple JSON object

      // Rename the populated fields
      const pendingAppointments = pendingAppointmentsRaw.map((appt) => {
        const { userId, ...rest } = appt;
        return {
          ...rest,
          user: userId,
        };
      });
      return res.status(200).json({ appointments: pendingAppointments });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error retrieving pending appointments" });
    }
  }
);

appointmentRouter.get("/getAppointments", isAuthorized, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).lean();
    if (!user)
      return res.status(404).json({ error: "Invalid userId, not found" });
    const appointmentsForUser = await AppointmentModel.find({
      userId: req.user.id,
    }).lean(); // return simple JSON object
    return res.status(200).json({ appointments: appointmentsForUser });
  } catch (err) {
    res.status(500).json({
      error:
        "Error retrieving unpaid appointments for user with _id:" + req.user.id,
    });
  }
});

appointmentRouter.post(
  "/requestAppointment",
  isAuthorized,
  async (req, res) => {
    const appointmentData = req.body;
    try {
      // check if they are valid object id's
      if (!Types.ObjectId.isValid(appointmentData.vaccineId)) {
        return res.status(400).json({ error: "Invalid vaccineId format" });
      }
      if (!Types.ObjectId.isValid(appointmentData.hospitalId)) {
        return res.status(400).json({ error: "Invalid hospitalId format" });
      }

      // Check that the vaccine, hospital, and user exists in DB
      const user = await UserModel.findById(req.user.id).lean();
      if (!user) {
        return res.status(404).json({ error: "Invalid userId, not found" });
      } else {
        appointmentData.userId = req.user.id;
      }
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
      // return all the appointments for this user
      const appointmentsForUser = await AppointmentModel.find({
        userId: req.user.id,
      }).lean(); // return simple JSON object
      return res.status(200).json({ appointments: appointmentsForUser });
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError") {
        // Mongoose validation error
        return res.status(400).json({
          error: "Validation failed",
          details: err.errors,
        });
      }
      return res.status(500).json({ error: "Error in saving appointment" });
    }
  }
);

appointmentRouter.put(
  "/approveAppointment/:appointmentId",
  isAuthorized,
  async (req, res) => {
    try {
      // check if they are valid object id
      if (!Types.ObjectId.isValid(req.params.appointmentId)) {
        return res.status(400).json({ error: "Invalid appointmentId format" });
      }
      // Check that the user exists and has admin privileges in DB
      const user = await UserModel.findById(req.user.id).lean();
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
        return res.status(404).json({
          error: `Could not find appointment with id: ${req.params.appointmentId}`,
        });
      const pendingAppointmentsRaw = await AppointmentModel.find({
        approved: false,
      })
        .populate({
          path: "userId",
          select: "-password",
          populate: {
            path: "demographicData",
            model: "demographicData",
          },
        })
        .lean(); // return simple JSON object
      const pendingAppointments = pendingAppointmentsRaw.map((appt) => {
        const { userId, ...rest } = appt;
        return {
          ...rest,
          user: userId,
        };
      });
      return res.status(200).json({ appointments: pendingAppointments });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error in approving appointment" });
    }
  }
);

appointmentRouter.put(
  "/payAppointment/:appointmentId",
  isAuthorized,
  async (req, res) => {
    const appointmentId = req.params.appointmentId;
    try {
      // check if they are valid object id
      if (!Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ error: "Invalid appointmentId format" });
      }

      // Try to update the appointment to be paid
      const appointment = await AppointmentModel.findOne({
        _id: appointmentId,
        approved: true,
      }).populate('hospitalId vaccineId userId');;

      if (!appointment)
        return res.status(404).json({
          error: `Could not find APPROVED appointment with id: ${appointmentId}`,
        });

      // only the appointment's owner-user can pay for the appointment
      if (appointment.userId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You are not authorized to pay this appointment" });
      } else {
        if (appointment.paid) {
          return res
            .status(409)
            .json({ error: "Appointment has already been paid" });
        }
        appointment.paid = true;
        await appointment.save();
        console.log({appointment})
        generateCompletedAppointmentPDF(appointment);
      }
      const appointmentsForUser = await AppointmentModel.find({
        userId: appointment.userId,
      }).lean(); // return simple JSON object
      return res.status(200).json({ appointments: appointmentsForUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error in paying appointment" });
    }
  }
);

export default appointmentRouter;
