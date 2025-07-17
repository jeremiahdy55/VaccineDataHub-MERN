import * as ActionTypes from "../ActionTypes";
import axios from "axios";

// === Define Action Creators ===
export const setDemographicData = (demographicData) => ({
  type: ActionTypes.SET_DEMO_DATA,
  payload: demographicData,
});

export const clearDemographicDataStore = () => ({
  type: ActionTypes.CLEAR_DEMO_DATA,
});

// === Define Thunks ===
export const getDemographicData = () => {
  return async function (dispatch) {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/demographicData/getDemographicData`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Set appointment data into store
      const demographicData = response.data.demographicData;
      dispatch(setDemographicData(demographicData));
    } catch (err) {
      console.error(`Error While Retrieving Demographic Data`, err);
    }
  };
};