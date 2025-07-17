import * as ActionTypes from "../ActionTypes";

const Initial_State = {
  demographicData: [],
};

const demographicDataReducer = (state = Initial_State, action) => {
  switch (action.type) {
    case ActionTypes.SET_DEMO_DATA:
      return {
        ...state,
        demographicData: action.payload,
      };

    case ActionTypes.CLEAR_DEMO_DATA:
      return {
        ...state,
        demographicData: Initial_State.demographicData,
      };

    default:
      return state;
  }
};

export default demographicDataReducer;
