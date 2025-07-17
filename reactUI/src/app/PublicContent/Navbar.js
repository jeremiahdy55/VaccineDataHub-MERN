import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import NavbarSections from "./NavbarComponents/NavbarSection";
import { logoutAndClearStore } from "../ReduxStore/LogoutFunctionality";

const Navbar = () => {
  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.userReducer.user);

  // only show navbar if admin or patient secure content
  const showSecNavbarPaths= ["/admin", "/patient"];
  const showSecNavbar = showSecNavbarPaths.some(prefix =>
    location.pathname.startsWith(prefix)
  );
  const showPatientNavSections = location.pathname.startsWith("/patient");

  const handleLogout = async (evt) => {
    await dispatch(logoutAndClearStore());
    navigate("/");
  };

  const navSections = [{ label: "💚 Home", path: "/" }];
  const patientNavSections = [
    { label: "Hospital | Vaccine Data", path: "/patient" },
    { label: "Make Appointment", path: "/patient/makeAppointment" },
    { label: "Vaccination Record", path: "/patient/vaccinationHistory" },
  ];
  const adminNavSections = [
    { label: "Hospital | Vaccine Data", path: "/admin" },
    { label: "Approve Appointments", path: "/admin/pendingAppointments" },
    { label: "Register New Vaccine", path: "/admin/registerVaccine" },
  ];
  
  if (user._id) {
    navSections.push({
      label: "My Appointments",
      path: "/patient",
    });
    if (user.adminPrivilege) {
      navSections.push({
        label: "Admin Portal",
        path: "/admin",
      });
    }
  }

  return (
    <div>
      <BootstrapNavbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="custom-navbar"
      >
        <Container
          fluid
          className="p-0 d-flex align-items-stretch custom-navbar"
        >
          <NavbarSections navSections={navSections} isSecondaryNavbar={false} />

          {user._id ? (
            <div className="d-flex align-items-stretch">
              <button
                onClick={handleLogout}
                className="btn btn-danger nav-button"
              >
                Logout: {user.name}
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-stretch">
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary nav-button d-flex align-items-center justify-content-center"
              >
                Login
              </button>
            </div>
          )}
        </Container>
      </BootstrapNavbar>
      { showSecNavbar && <BootstrapNavbar
        style={{ backgroundColor: "#7dd69b" }}
        variant="light"
        expand="lg"
        className="custom-navbar"
      >
        <Container
          fluid
          className="p-0 d-flex align-items-stretch custom-navbar"
        >
          <NavbarSections 
          navSections={(showPatientNavSections ? patientNavSections : adminNavSections)} 
          isSecondaryNavbar={true} 
          />
        </Container>
      </BootstrapNavbar>}
    </div>
  );
};

export default Navbar;
