import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./User/UserReducer";
import hospitalReducer from "./Hospital/HospitalReducer";
import vaccineReducer from "./Vaccine/VaccineReducer";
import appointmentReducer from "./Appointments/AppointmentReducer";
import demographicDataReducer from "./DemographicData/DemographicDataReducer";

let rootReducer = combineReducers({
  userReducer,
  hospitalReducer,
  vaccineReducer,
  appointmentReducer,
  demographicDataReducer
});

// for production, use the store without logger() middleware
// export default configureStore({reducer: rootReducer});


// to debug during development, include store-logger middleware
function logger({ getState }) {
  return (next) => (action) => {
    console.log("will dispatch", action);
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);
    console.log("state after dispatch", getState());
    return returnValue;
  };
}

export default configureStore(
  {
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  },
  {}
);

