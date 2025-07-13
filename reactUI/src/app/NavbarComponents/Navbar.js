import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import NavbarSections from "./NavbarSection";

const Navbar = () => {
  // hooks
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);
  const location = useLocation();

  // only show navbar if admin or patient secure content
  const showSecNavbarPaths= ["/admin", "/patient"];
  const showSecNavbar = showSecNavbarPaths.some(prefix =>
    location.pathname.startsWith(prefix)
  );

  const handleLogout = (evt) => {
    evt.preventDefault();
    // TODO: Add actual logout logic (e.g., clearing Redux state)
    navigate("/");
  };

  const navSections = [{ label: "💚 Home", path: "/" }];
  
  if (user.name) {
    navSections.push({
      label: "Patient Dashboard (rename me later)",
      path: "/dashboard",
    });
    if (user.adminPrivilege) {
      navSections.push({
        label: "Admin Portal (rename me later)",
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

          {user.name ? (
            <div className="d-flex align-items-stretch">
              <button
                onClick={handleLogout}
                className="btn btn-danger nav-button"
              >
                Logout
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
          <NavbarSections navSections={navSections} isSecondaryNavbar={true} />
        </Container>
      </BootstrapNavbar>}
    </div>
  );
};

export default Navbar;
