import React from "react";

const SelectableList = ({ items, type, onSelect }) => {
  // type: "hospital" or "vaccine", will break otherwise

  return (
    <div>
      <div className={`card border-${type === "hospital" ? "primary" : "success"} h-100 d-flex flex-column`}>
        <div className={`card-header bg-${type === "hospital" ? "primary" : "success"} text-white fw-semibold`}>
          {type === "hospital" ? "Hospitals" : "Vaccines"}
        </div>
        <div className="card-body overflow-auto" style={{ maxHeight: "60vh" }}>
          {items.length === 0 ? (
            <p className="text-muted">No {type}s found.</p>
          ) : (
            items.map((item, idx) => {
              const clickHandler = onSelect ? () => onSelect(item) : undefined;
              return (
                <div
                  key={idx}
                  onClick={clickHandler}
                  className={`border rounded p-3 mb-3 bg-light shadow-sm ${onSelect ? "clickable-item" : ""}`}
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                >
                  {type === "hospital" ? (
                    <>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="mb-1 text-muted"><i>{item.address}</i></p>
                      <p className="mb-1"><strong>Type:</strong> {item.type}</p>
                      <p className="mb-0"><strong>Service Charge:</strong> ${item.serviceCharge}</p>
                    </>
                  ) : (
                    <>
                      <h5 className="mb-1">
                        {item.name} <small className="text-muted">({item.abbreviation})</small>
                      </h5>
                      <p className="mb-1"><strong>Type:</strong> {item.type}</p>
                      <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
                      <p className="mb-1"><strong>Origin:</strong> {item.origin}</p>
                      <p className="mb-1"><strong>Doses Required:</strong> {item.dosesRequired}</p>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectableList;
