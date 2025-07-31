import React from "react";

const SelectableHospitalList = ({ items, onSelect }) => {
  // creates a scrollable-clickable hospital modal list

  return (
    <div>
      <div className={`card border-primary h-100 d-flex flex-column`}>
        <div className={`card-header bg-primary text-white fw-semibold`}>
          Hospitals
        </div>
        <div className="card-body overflow-auto" style={{ maxHeight: "60vh" }}>
          {items.length === 0 ? (
            <p className="text-muted">No hospitals found.</p>
          ) : (
            items.map((item, idx) => {
              const clickHandler = onSelect ? () => onSelect(item) : undefined;
              return (
                <div
                  key={idx}
                  onClick={clickHandler}
                  className={`border rounded p-3 mb-3 bg-light shadow-sm ${
                    onSelect ? "clickable-item" : ""
                  }`}
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                >
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1 text-muted">
                    <i>{item.address}</i>
                  </p>
                  <p className="mb-1">
                    <strong>Type:</strong> {item.type}
                  </p>
                  <p className="mb-0">
                    <strong>Service Charge:</strong> ${item.serviceCharge}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectableHospitalList;
