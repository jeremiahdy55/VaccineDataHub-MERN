import * as ActionTypes from "../ActionTypes";
import axios from "axios";
import { handleTokenFromResponse } from "../../JWTAuthentication/TokenAuthentication";

// === Define Action Creators ===
export const setAppointments = (appointments) => ({
  type: ActionTypes.SET_APPTS,
  payload: appointments,
});

export const clearAppointmentStore = () => ({
  type: ActionTypes.CLEAR_APPTS,
});

// === Define Thunks ===
export const getAppointmentsByUserIdFromToken = () => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9000/api/appointment/getAppointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set appointment data into store
      const appointmentData = response.data.appointments;
      dispatch(setAppointments(appointmentData));
    } catch (err) {
      console.error(`Error While Retrieving Appointment`, err);
    }
  };
};

export const requestAppointment = (appointmentObj) => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:9000/api/appointment/requestAppointment`,
        appointmentObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set appointment data into store
      const appointmentData = response.data.appointments;
      dispatch(setAppointments(appointmentData));
    } catch (err) {
      if (err.response?.status === 409) {
        alert("An identical appointment already exists.");
      } else {
        console.error("Error requesting appointment:", err);
      }
    }
  };
};

export const payAppointment = (appointmentId) => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:9000/api/appointment/payAppointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set appointment data into store
      const appointmentData = response.data.appointments;
      dispatch(setAppointments(appointmentData));
    } catch (err) {
      console.error(
        `Error While Paying for Appointment: ${appointmentId}`,
        err
      );
    }
  };
};

// Admin-only appointment thunks
export const getPendingAppointments = () => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9000/api/appointment/getPendingAppointments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set appointment data into store
      const appointmentData = response.data.appointments;
      dispatch(setAppointments(appointmentData));
    } catch (err) {
      console.error(`Error While Retrieving Pending Appointments`, err);
    }
  };
};

export const approveAppointment = (appointmentId) => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:9000/api/appointment/approveAppointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set appointment data into store
      const appointmentData = response.data.appointments;
      dispatch(setAppointments(appointmentData));
    } catch (err) {
      console.error(`Error While Approving Appointment: ${appointmentId}`, err);
    }
  };
};
