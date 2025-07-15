
import { logoutUser } from "./User/UserAction"
import { clearHospitalStore } from "./Hospital/HospitalAction";
import { clearVaccineStore } from "./Vaccine/VaccineAction";
import { clearAppointmentStore } from "./Appointments/AppointmentAction";


export const logoutAndClearStore = () => {
    return async function (dispatch) {
        dispatch(logoutUser());
        dispatch(clearHospitalStore());
        dispatch(clearVaccineStore());
        dispatch(clearAppointmentStore());
        sessionStorage.removeItem("token");
    }
};