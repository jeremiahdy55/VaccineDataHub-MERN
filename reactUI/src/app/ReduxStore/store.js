import { combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit';

import userReducer from "./UserAuth/UserReducer";

let rootReducer = combineReducers({
    userReducer, //userReducer : userReducer
    // productReducer,
    // cartReducer,
    // couponReducer,
    // orderReducer,
    // reviewsReducer,
    // notificationsReducer
  })


function logger({ getState }) {

  return next => action => {
    console.log('will dispatch', action)
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action)
    console.log('state after dispatch', getState())
    return returnValue
  }
}

export default configureStore({
        reducer : rootReducer,
        middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
    },
    {}
);
