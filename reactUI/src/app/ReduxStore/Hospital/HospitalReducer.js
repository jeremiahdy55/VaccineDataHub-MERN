import * as ActionTypes from "../ActionTypes";

const Initial_State = {
    hospitals: []
}

const hospitalReducer = (state = Initial_State, action) => {
    switch (action.type) {
      // update redux-stor cartReducer data
      case ActionTypes.SET_HOSPITALS:
        return {
          ...state,
          hospitals: hospitals
        };
  
      default:
        return state;
    }
  };
  
  export default cartReducer;