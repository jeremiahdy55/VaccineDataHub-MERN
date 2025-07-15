import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getHospitals } from "../../ReduxStore/Hospital/HospitalAction";
import { getVaccines } from "../../ReduxStore/Vaccine/VaccineAction";
import { getAppointmentsByUserIdFromToken, payAppointment } from "../../ReduxStore/Appointments/AppointmentAction";
import AppointmentDetailModal from "./VaccinationHistoryComponents/AppointmentDetailModal";

const VaccinationHistory = () => {
  // hooks
  const dispatch = useDispatch();

  // get data from store
  const vaccines = useSelector((state) => state.vaccineReducer.vaccines) || [];
  const hospitals =
    useSelector((state) => state.hospitalReducer.hospitals) || [];
  const appointmentsRaw =
    useSelector((state) => state.appointmentReducer.appointments) || [];

  // populate data from the respective id fields
  const appointments = appointmentsRaw.map((appt) => {
    const vaccine = vaccines.find((v) => v._id === appt.vaccineId);
    const hospital = hospitals.find((h) => h._id === appt.hospitalId);

    return {
      ...appt,
      vaccine,
      hospital,
    };
  });

  // repopulate the store
  useEffect(() => {
    dispatch(getHospitals());
    dispatch(getVaccines());
    dispatch(getAppointmentsByUserIdFromToken());
  }, [dispatch]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const payFromModal = async (appointment) => {
    await dispatch(payAppointment(appointment._id));
    setShowModal(false);
  }

  const today = new Date();
  today.setHours(0,0,0,0);;
  const futureAppointments = appointments
    .filter((appt) => {
        const apptDate = new Date(appt.appointmentDate);
        apptDate.setHours(0,0,0,0);
        return (apptDate > today) || (!appt.approved || !appt.paid);})
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const pastAppointments = appointments
    .filter((appt) => {
        const apptDate = new Date(appt.appointmentDate);
        apptDate.setHours(0,0,0,0);
        return (apptDate <= today) && (appt.approved && appt.paid);})
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const renderCard = (appt, idx, isFuture = false) => (
    <div
      key={idx}
      className={`border rounded p-3 mb-3 shadow-sm ${isFuture ? "bg-secondary-subtle" : "bg-light"}`}
      role="button"
      onClick={() => openModal(appt)}
    >
      <h4 className="mb-1">
        {appt.vaccine?.name || "Unknown Vaccine"}{" "}
        [ <i>{appt.vaccine?.abbreviation}</i> ]
      </h4>
      <p className="mb-1">
        <strong>Hospital:</strong> {appt.hospital?.name} [ <i>{appt.hospital?.type}</i> ]
      </p>
      <p className="mb-1">
        <strong>Appointment Date:</strong>{" "}
        {new Date(appt.appointmentDate).toLocaleDateString()}
      </p>
      { isFuture && 
      (<><p className="mb-1">
        <strong>Approved:</strong>{" "}
        <span className={appt.approved ? "text-success" : "text-danger"}>
          {appt.approved ? "YES" : "NO"}
        </span>
      </p>
      <p className="mb-0">
        <strong>Paid:</strong>{" "}
        <span className={appt.paid ? "text-success" : "text-danger"}>
          {appt.paid ? "YES" : "NO"}
        </span>
      </p>
      </>)}
    </div>
  );

  return (
    <>
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            {futureAppointments.length > 0 && (
              <>
                <h4 className="mb-4 mt-3 text-secondary border-bottom pb-2">
                  Upcoming Appointments
                </h4>
                {futureAppointments.map((appt, idx) =>
                  renderCard(appt, idx, true)
                )}
              </>
            )}
  
            {pastAppointments.length >= 0 && (
              <>
                <h4 className="mb-4 mt-5 text-secondary border-bottom pb-2">
                  Vaccination Record
                </h4>
                {pastAppointments.map((appt, idx) =>
                  renderCard(appt, idx, false)
                )}
              </>
            )}
  
            {appointments.length === 0 && (
              <p className="text-muted text-center">No vaccination history found.</p>
            )}
          </div>
        </div>
      </div>
  
      <AppointmentDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        paymentBtnClick={() => payFromModal(selectedAppointment)}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default VaccinationHistory;