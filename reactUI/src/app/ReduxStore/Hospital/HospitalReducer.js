import * as ActionTypes from "../ActionTypes";

const Initial_State = {
    hospitals: []
}

const hospitalReducer = (state = Initial_State, action) => {
    switch (action.type) {
      case ActionTypes.SET_HOSPITALS:
        return {
          ...state,
          hospitals: action.payload.hospitals
        };
  
      default:
        return state;
    }
  };
  
  export default cartReducer;