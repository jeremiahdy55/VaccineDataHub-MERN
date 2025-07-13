import * as ActionTypes from "../ActionTypes";

const Initial_State = {
  user: {
    _id: "",
    username: "",
    name: "",
    address: "",
    phoneNo: "",
    email: "",
    adminPrivilege: false,
    demographicData: "",
  }
};

const userReducer = (state = Initial_State, action) => {
    switch (action.type) {
      // update redux-stor cartReducer data
      case ActionTypes.SET_USER_DATA:
        return {
          ...state,
          user: action.payload.user
        };
      case ActionTypes.LOGOUT_USER:
        return {
            ...state,
            user: {...Initial_State.user}
        }
  
      default:
        return state;
    }
  };
  
  export default userReducer;