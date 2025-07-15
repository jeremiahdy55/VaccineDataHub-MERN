import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./User/UserReducer";
import hospitalReducer from "./Hospital/HospitalReducer";
import vaccineReducer from "./Vaccine/VaccineReducer";
import appointmentReducer from "./Appointments/AppointmentReducer";

let rootReducer = combineReducers({
  userReducer,
  hospitalReducer,
  vaccineReducer,
  appointmentReducer
});

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
