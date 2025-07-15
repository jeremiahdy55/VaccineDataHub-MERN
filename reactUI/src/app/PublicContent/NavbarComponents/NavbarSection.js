import React from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";

const NavbarSections = ({ navSections, isSecondaryNavbar }) => {
  const navigate = useNavigate();

  const containerClass = (isSecondaryNavbar)
    ? "secondary-nav-zone text-center d-flex align-items-center"
    : "nav-zone text-white text-center d-flex align-items-center";

  const navClass = "left-flush-nav-section d-flex";

  return (
    <Nav className={navClass}>
      {navSections.map(({ label, path }, index) => (
        <div
          key={index}
          className={containerClass}
          onClick={() => navigate(path)}
          role="button"
        >
          <span>{label}</span>
        </div>
      ))}
    </Nav>
  );
};

export default NavbarSections;
