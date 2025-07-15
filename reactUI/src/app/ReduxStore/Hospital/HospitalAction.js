import * as ActionTypes from "../ActionTypes";
import axios from "axios";
import { handleTokenFromResponse } from "../../JWTAuthentication/TokenAuthentication";

// === Define Action Creators ===
export const setHospitals = (hospitals) => ({
  type: ActionTypes.SET_HOSPITALS,
  payload: hospitals
});

export const clearHospitalStore = () => ({
  type: ActionTypes.CLEAR_HOSPITAL,
});

// === Define Thunks ===
export const getHospitals = () => {
  return async function (dispatch) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:9000/api/hospital/getHospitals",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set user's data into store
      const hospitalData = response.data.hospitals;
      dispatch(setHospitals(hospitalData));
    } catch (err) {
      console.error("Error While Retrieving Hospital Data", err);
    }
  };
};