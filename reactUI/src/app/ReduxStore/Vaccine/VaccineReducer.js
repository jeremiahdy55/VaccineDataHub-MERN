import * as ActionTypes from "../ActionTypes";

const Initial_State = {
    vaccines: []
};

const vaccineReducer = (state = Initial_State, action) => {
    switch (action.type) {
      case ActionTypes.SET_VACCINES:
        return {
          ...state,
          vaccines: action.payload
        };
        case ActionTypes.CLEAR_VACCINES:
          return {
            ...state,
            vaccines: Initial_State.vaccines
          };
      default:
        return state;
    }
  };
  
  export default vaccineReducer;