import * as ActionTypes from "../ActionTypes";

const Initial_State = {
  appointments: [],
};

const appointmentReducer = (state = Initial_State, action) => {
  switch (action.type) {
    case ActionTypes.SET_APPTS:
      return {
        ...state,
        appointments: action.payload,
      };

    case ActionTypes.CLEAR_APPTS:
      return {
        ...state,
        appointments: Initial_State.appointments,
      };

    default:
      return state;
  }
};

export default appointmentReducer;
