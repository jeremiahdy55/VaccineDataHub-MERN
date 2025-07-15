import axios from "axios";
import {logoutAndClearStore} from "../ReduxStore/LogoutFunctionality"

// helper function to extract and set token from response headers
export const handleTokenFromResponse = (response) => {
    const token = response.headers["x-access-token"];
    if (token) {
      console.log('token has been placed or refreshed')
      sessionStorage.setItem("token", token);
    }
    return token;
};


export const isAuthenticated = () => {
  return async function (dispatch) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:9000/user/check",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const isAuthenticated = response.data.authenticated;
      if (!isAuthenticated) {
        dispatch(logoutAndClearStore());
      }
      // Get token
      handleTokenFromResponse(response);
      
      return isAuthenticated;
    } catch (err) {
      console.error("Error While Logging In", err);
      dispatch(logoutAndClearStore());
      return false;
    }
  };
};