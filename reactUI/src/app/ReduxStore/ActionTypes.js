// Consolidate each dispatched action type to ensure equality/conditionals function properly
// *Each time action type is checked, it will be called from here to ensure no reference error
// NOTE: string value is irrelevant, just make sure that each const is unique to the others

export const SET_HOSPITALS = "SET_HOSPITALS";
export const CLEAR_HOSPITAL = "CLEAR_HOSPITALS";
export const SET_USER_DATA = "SET_USER_DATA";
export const LOGOUT_USER = "LOGOUT_USER";
export const SET_VACCINES = "SET_VACCINES";
export const CLEAR_VACCINES = "CLEAR_VACCINES";
export const SET_DEMO_DATA = "SET_DEMO_DATA";
export const CLEAR_DEMO_DATA = "CLEAR_DEMO_DATA";
export const SET_APPTS = "SET_APPTS";
export const CLEAR_APPTS = "CLEAR_APPTS";
