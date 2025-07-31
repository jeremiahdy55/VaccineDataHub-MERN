import React from "react";
import { Modal } from "react-bootstrap";
import SelectableVaccineList from "./SelectableVaccineList";

const VaccineModal = ({ show, onClose, vaccines, onSelect, age }) => {
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
        <SelectableVaccineList itemsRaw={vaccines} onSelect={handleSelect} userAge={age}/>
      </Modal.Body>
    </Modal>
  );
};

export default VaccineModal;