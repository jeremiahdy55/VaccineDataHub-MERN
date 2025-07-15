import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HospitalModal from "./AppointmentFormComponents/HospitalModal";
import VaccineModal from "./AppointmentFormComponents/VaccineModal";
import { getHospitals } from "../../ReduxStore/Hospital/HospitalAction";
import { getVaccines } from "../../ReduxStore/Vaccine/VaccineAction";
import { requestAppointment } from "../../ReduxStore/Appointments/AppointmentAction";

const AppointmentForm = () => {
  // hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get data from store
  const hospitals =
    useSelector((state) => state.hospitalReducer.hospitals) || [];
  const vaccines = useSelector((state) => state.vaccineReducer.vaccines) || [];

  // booleans to show the modals
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);

  // the user's selected values
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // repopulate the store if necessary
  useEffect(() => {
    if (hospitals.length === 0) dispatch(getHospitals());
    if (vaccines.length === 0) dispatch(getVaccines());
  }, [dispatch]);

  // Get today's date in YYYY-MM-DD format for appointmentDate.min attribute
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // add local timezone-midnight to the selected date
    const dateWithLocalTZ = new Date(`${selectedDate}T00:00:00`);
    await dispatch(
      requestAppointment({
        vaccineId: selectedVaccine._id,
        hospitalId: selectedHospital._id,
        appointmentDate: dateWithLocalTZ.toISOString(),
      })
    );
    navigate("/patient/vaccinationHistory");
  };

  return (
    <div className="mt-5 container d-flex justify-content-center">
      <div className="card p-4 w-75">
        <div className="bg-success text-white p-3 rounded mb-4 text-center">
          <h2 className="mb-0">Book a Vaccination Appointment</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* hospital selection */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">
                <strong>Hospital:</strong>
              </label>
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => setShowHospitalModal(true)}
              >
                {selectedHospital ? selectedHospital.name : "Choose Hospital"}
              </button>
            </div>
            {/* vaccine selection */}
            <div className="col">
              <label className="form-label">
                <strong>Vaccine:</strong>
              </label>
              <button
                type="button"
                className="btn btn-outline-success w-100"
                onClick={() => setShowVaccineModal(true)}
              >
                {selectedVaccine ? selectedVaccine.name : "Choose Vaccine"}
              </button>
            </div>
          </div>

          {/* appointmentDate */}
          <div className="mb-4">
            <label htmlFor="appointmentDate" className="form-label">
              <strong>Appointment Date:</strong>
            </label>
            <input
              type="date"
              id="appointmentDate"
              className="form-control"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            <strong>Confirm Appointment</strong>
          </button>
        </form>
      </div>

      {/* Modals */}
      <HospitalModal
        show={showHospitalModal}
        onClose={() => setShowHospitalModal(false)}
        hospitals={hospitals}
        onSelect={(h) => {
          setSelectedHospital(h);
          setShowHospitalModal(false);
        }}
      />

      <VaccineModal
        show={showVaccineModal}
        onClose={() => setShowVaccineModal(false)}
        vaccines={vaccines}
        onSelect={(v) => {
          setSelectedVaccine(v);
          setShowVaccineModal(false);
        }}
      />
    </div>
  );
};

export default AppointmentForm;
