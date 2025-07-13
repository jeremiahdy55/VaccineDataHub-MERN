import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./AuthComponents/Login";
import RegisterUser from "./AuthComponents/RegisterUser";
import Navbar from "./NavbarComponents/Navbar";

// Declare routes here
let AppContent = () => {
  const location = useLocation();

  // only show navbar if NOT on register or login pages
  const hideNavbarPaths = ["/login", "/register"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterUser />} />

        {/* TODO wrap these in secure content wrapper */}
        <Route path="admin" element={<Home />}>
            <Route index element={<Home />} />
            <Route path="patientList" element={<Home />} />
            <Route path="registerVaccine" element={<Home />} />
            <Route path="approveAppointments" element={<Home />} />
        </Route>
        <Route path="patient" element={<Home />}>
            <Route index element={<Home />} />
            <Route path="makeAppointment" element={<Home />} />
            <Route path="vaccinationHistory" element={<Home />} />
        </Route>

        {/* Reroute all other attempts to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppContent;
