
import { logoutUser } from "./User/UserAction"
import { clearHospitalStore } from "./Hospital/HospitalAction";
import { clearVaccineStore } from "./Vaccine/VaccineAction";
import { clearAppointmentStore } from "./Appointments/AppointmentAction";
import { clearDemographicDataStore } from "./DemographicData/DemographicDataAction";

export const logoutAndClearStore = () => {
    return async function (dispatch) {
        // NOTE: due to logout routing the user immediately back to home
        // vaccine and demographicData will immediately be repopulated
        // Still, clear the store here for fresh slate each time.
        dispatch(clearVaccineStore());
        dispatch(clearDemographicDataStore());
        dispatch(clearHospitalStore());
        dispatch(clearAppointmentStore());
        dispatch(logoutUser());    
        sessionStorage.removeItem("token");
        window.location.href = "/";
    }
};