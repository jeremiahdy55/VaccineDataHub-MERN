import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container py-4">
        <div className="row">
          {/* about us section */}
          <div className="col-md-6 mb-3">
            <h5><strong>About Us</strong></h5>
            <hr/>
            <p>
              AVAA Health (Assistant for Vaccination Appointments and Analytics)
              streamlines vaccination management. Users can request, pay for,
              and track vaccination appointments, while medical staff approve
              requests and manage vaccine data. General visitors see broad
              demographics; detailed analytics are reserved for medical
              personnel.
            </p>
          </div>

          {/* contact information section */}
          <div className="col-md-6 mb-3">
            <h5><strong>Contact Information</strong></h5>
            <hr/>
            <ul className="list-unstyled">
              <li>Email: contact@avaahealth.org</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Example St., New York City, NY 12345</li>
            </ul>
          </div>
        </div>
        <hr className="border" />
        <div className="text-center">
          <small>
            &copy; {new Date().getFullYear()} AAVA Health. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
