import * as ActionTypes from "../ActionTypes";
import axios from "axios";
import { handleTokenFromResponse } from "../../JWTAuthentication/TokenAuthentication";

// === Define Action Creators ===
export const setVaccines = (vaccines) => ({
  type: ActionTypes.SET_VACCINES,
  payload: vaccines
});

export const clearVaccineStore = () => ({
  type: ActionTypes.CLEAR_VACCINES,
});

// === Define Thunks ===
export const getVaccines = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/vaccine/getVaccines",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Set vaccine data into store
      const vaccineData = response.data.vaccines;
      dispatch(setVaccines(vaccineData));
    } catch (err) {
      console.error("Error While Retrieving Vaccine Data", err);
    };
  };
};

export const registerVaccine = (vaccine) => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw "No JWT for authorization found";

      const response = await axios.post(
        "http://localhost:9000/api/vaccine/registerVaccine",
        vaccine,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Get token
      handleTokenFromResponse(response);

      // Set vaccine data into store
      const vaccineData = response.data.vaccines;
      dispatch(setVaccines(vaccineData));
    } catch (err) {
      console.error("Error while Registering a new Vaccine", err);
      throw err;
    };
  };
};