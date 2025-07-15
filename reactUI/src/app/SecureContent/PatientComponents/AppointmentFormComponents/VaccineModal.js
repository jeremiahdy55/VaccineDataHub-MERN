import React from "react";
import { Modal } from "react-bootstrap";
import SelectableList from "./SelectableList";

const VaccineModal = ({ show, onClose, vaccines, onSelect }) => {
  const handleSelect = (vaccine) => {
    onSelect(vaccine);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Choose Vaccine</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SelectableList items={vaccines} type="vaccine" onSelect={handleSelect} />
      </Modal.Body>
    </Modal>
  );
};

export default VaccineModal;