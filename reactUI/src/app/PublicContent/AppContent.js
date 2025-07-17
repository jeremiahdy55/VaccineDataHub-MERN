import React from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./AuthComponents/Login";
import RegisterUser from "./AuthComponents/RegisterUser";
import Navbar from "./Navbar";
import PrivateRoute from "../SecureContent/PrivateRoute";
import MedicalDataGrid from "../SecureContent/MedicalDataGrid";
import Footer from "./Footer";
import AppointmentForm from "../SecureContent/PatientComponents/AppointmentForm";
import RegisterVaccineForm from "../SecureContent/AdminComponents/RegisterVaccineForm";
import VaccinationHistory from "../SecureContent/PatientComponents/VaccinationHistory";
import PendingAppointments from "../SecureContent/AdminComponents/PendingAppointments";

// Declare routes here
let AppContent = () => {
  const location = useLocation();

  // only show navbar if NOT on register or login pages
  const hideNavbarPaths = ["/login", "/register"];
  const onUserEntryPage = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="page-container">
    <div className="content-wrap">
      {!onUserEntryPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterUser />} />

        <Route path="admin" element={<PrivateRoute />}>
            <Route index element={<MedicalDataGrid />} />
            <Route path="registerVaccine" element={<RegisterVaccineForm />} />
            <Route path="pendingAppointments" element={<PendingAppointments />} />
        </Route>
        <Route path="patient" element={<PrivateRoute />}>
            <Route index element={<MedicalDataGrid />} />
            <Route path="makeAppointment" element={<AppointmentForm />} />
            <Route path="vaccinationHistory" element={<VaccinationHistory />} />
        </Route>

        {/* Reroute all other attempts to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
      {!onUserEntryPage && <Footer />}
    </div>
  );
};

export default AppContent;
