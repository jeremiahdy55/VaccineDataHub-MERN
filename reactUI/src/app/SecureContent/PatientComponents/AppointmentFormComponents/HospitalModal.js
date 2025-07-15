import React from "react";
import { Modal } from "react-bootstrap";
import SelectableList from "./SelectableList";

const HospitalModal = ({ show, onClose, hospitals, onSelect }) => {
  const handleSelect = (hospital) => {
    onSelect(hospital);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Choose Hospital</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SelectableList items={hospitals} type="hospital" onSelect={handleSelect} />
      </Modal.Body>
    </Modal>
  );
};

export default HospitalModal;