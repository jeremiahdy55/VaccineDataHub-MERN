import React from "react";
import { Modal, Button } from "react-bootstrap";

const AppointmentDetailModal = ({ show, onClose, paymentBtnClick, appointment }) => {
  if (!appointment) return null;

  const { hospital, vaccine } = appointment;

  // string format the price
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const total = (vaccine?.price || 0) + (hospital?.serviceCharge || 0);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Appointment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="mb-3">
          {vaccine?.name} <br /> [ <i>{vaccine?.abbreviation}</i> ]
        </h4>

        <h6 className="text-muted">Hospital Info</h6>
        <p>
          <strong>Name:</strong> {hospital?.name}
          <br />
          <strong>Type:</strong> {hospital?.type}
          <br />
          <strong>Address:</strong> {hospital?.address}
        </p>

        <h6 className="text-muted">Vaccine Info</h6>
        <p>
          <strong>Type:</strong> {vaccine?.type}
          <br />
          <strong>Origin:</strong> {vaccine?.origin}
          <br />
          <strong>Doses Required:</strong> {vaccine?.dosesRequired}
          <br />
          <strong>Strains Covered:</strong>{" "}
          {vaccine?.info?.strainsCovered?.join(", ") || "N/A"}
          <br />
          <strong>Common Side Effects:</strong>{" "}
          {vaccine?.sideEffects?.join(", ") || "None listed"}
        </p>

        <hr />
        <h6 className="text-muted">Charges</h6>
        <ul className="list-unstyled">
          <li>
            <strong>Vaccine Price:</strong>{" "}
            <span className="float-end">{formatCurrency(vaccine?.price)}</span>
          </li>
          <li>
            <strong>Service Charge:</strong>{" "}
            <span className="float-end">
              {formatCurrency(hospital?.serviceCharge)}
            </span>
          </li>
        </ul>
        <hr />
        <h5 className="text-end">
          Total: <span className="text-success">{formatCurrency(total)}</span>
        </h5>
      </Modal.Body>
      {!appointment.approved ? (
        <Modal.Footer>
        <span className="text-muted me-auto">
          This appointment is awaiting approval.
        </span>
        </Modal.Footer>
      ) : !appointment.paid ? (
        <Modal.Footer>
        <Button variant="warning" onClick={paymentBtnClick}>
          Submit Payment
        </Button>
        </Modal.Footer>
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;
