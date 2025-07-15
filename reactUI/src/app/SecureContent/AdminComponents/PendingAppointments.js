import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHospitals } from "../../ReduxStore/Hospital/HospitalAction";
import { getVaccines } from "../../ReduxStore/Vaccine/VaccineAction";
import { getPendingAppointments, approveAppointment } from "../../ReduxStore/Appointments/AppointmentAction";
import AppointmentWithUserDetailModal from "./PendingAppointmentComponents/AppointmentWithUserDetailModal";

const PendingAppointments = () => {
  // hooks
  const dispatch = useDispatch();

  // get data from store
  const vaccines = useSelector((state) => state.vaccineReducer.vaccines) || [];
  const hospitals = useSelector((state) => state.hospitalReducer.hospitals) || [];
  const appointmentsRaw = useSelector((state) => state.appointmentReducer.appointments) || [];

  // on mount, update store
  useEffect(() => {
    dispatch(getHospitals());
    dispatch(getVaccines());
    dispatch(getPendingAppointments());
  }, [dispatch]);

  // populate data from the respective id fields
  const appointments = appointmentsRaw.map((appt) => {
    const vaccine = vaccines.find((v) => v._id === appt.vaccineId);
    const hospital = hospitals.find((h) => h._id === appt.hospitalId);

    return {
      ...appt,
      vaccine,
      hospital,
    };
  }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));;

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  const handleApprove = async (appointment) => {
    if (appointment) {
      await dispatch(approveAppointment(appointment._id));
      setShowModal(false);
    }
  };

  const renderCard = (appt, idx) => {
    const { user } = appt;
    const demographics = user?.demographicData || {};

    return (
      <div key={idx} className="border rounded p-3 mb-4 shadow-sm bg-light" role="button" onClick={() => openModal(appt)}>
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-1">{appt.vaccine?.name || "Unknown Vaccine"} <br/> <small>[ <i>{appt.vaccine?.abbreviation}</i> ]</small></h5>
            <p className="mb-1">
              <strong>Hospital:</strong> {appt.hospital?.name} [ <i>{appt.hospital?.type}</i> ]
              <br />
              <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}
            </p>
          </div>
          <div className="col-md-6">
            <h5 className="text-muted">Patient:</h5>
            <p className="mb-1">
              <strong>Name:</strong> {user?.name}<br />
              <strong>Age:</strong> {demographics.age}, <strong>Gender:</strong> {demographics.gender}<br />
              <strong>Profession:</strong> {demographics.profession}<br />
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <h4 className="mb-4 text-secondary border-bottom pb-2">Pending Appointments</h4>
          {appointments.length === 0 ? (
            <p className="text-muted text-center">No pending appointments.</p>
          ) : (
            appointments.map((appt, idx) => renderCard(appt, idx))
          )}
        </div>
      </div>

      <AppointmentWithUserDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        approveBtnClick={() => handleApprove(selectedAppointment)}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default PendingAppointments;
