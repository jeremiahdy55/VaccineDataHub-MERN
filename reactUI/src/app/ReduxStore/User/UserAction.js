import * as ActionTypes from "../ActionTypes";
import axios from "axios";
import { handleTokenFromResponse } from "../../JWTAuthentication/TokenAuthentication";

// === Define Action Creators ===
export const setUser = (user) => ({
  // this function expects that user is a JS object with schema similar to
  // UserReducer {user}
  type: ActionTypes.SET_USER_DATA,
  payload: user,
});

export const logoutUser = () => ({
  type: ActionTypes.LOGOUT_USER,
});

// === Define Thunks ===
export const loginUser = (username, password) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(
        "http://localhost:9000/user/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set user's data into store
      const userData = response.data.user;
      dispatch(setUser(userData));
    } catch (err) {
      console.error("Error While Logging In", err);
    }
  };
};

export const registerUser = (userObj) => {
  return async function (dispatch) {
    try {
      const response = await axios.post(
        "http://localhost:9000/user/register",
        userObj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Get token
      handleTokenFromResponse(response);

      // Set user's data into store
      const userData = response.data.user;
      dispatch(setUser(userData));
    } catch (err) {
      console.error("Error While Logging In", err);
    }
  };
};

