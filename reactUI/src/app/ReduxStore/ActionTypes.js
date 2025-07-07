// Consolidate each dispatched action type to ensure equality/conditionals function properly
// *Each time action type is checked, it will be called from here to ensure no reference error
// NOTE: string value is irrelevant, just make sure that each const is unique to the others

export const SET_HOSPITALS = "SET_HOSPITALS";