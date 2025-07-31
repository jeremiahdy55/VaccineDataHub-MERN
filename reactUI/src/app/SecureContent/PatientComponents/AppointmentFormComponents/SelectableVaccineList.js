import React from "react";

const SelectableVaccineList = ({ itemsRaw, onSelect, userAge }) => {
  
  const [recommendedVax, otherVax] = itemsRaw.reduce(
    ([inside, outside], vax) => {
      if (userAge <= vax.info?.recommendedAgeMax && userAge >= vax.info?.recommendedAgeMin) {
        inside.push(vax);
      } else {
        outside.push(vax);
      }
      return [inside, outside]
    },
    [[],[]]
  );

  return (
    <div>
      <div className={`card border-success h-100 d-flex flex-column`}>
        <div className={`card-header bg-success text-white fw-semibold`}>
          Vaccines
        </div>
        <div className="card-body overflow-auto" style={{ maxHeight: "60vh" }}>
        {recommendedVax.length === 0 ? (
            <p className="text-muted">No vaccines found.</p>
          ) : (
            <>
            <h4 className="mb-4 mt-3 text-secondary border-bottom pb-2">
              Recommended Vaccines
            </h4>
            {recommendedVax.map((item, idx) => {
              const clickHandler = onSelect ? () => onSelect(item) : undefined;
              return (
                <div
                  key={idx}
                  onClick={clickHandler}
                  className={`border rounded p-3 mb-3 bg-light shadow-sm ${onSelect ? "clickable-item" : ""}`}
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                >
                      <h5 className="mb-1">
                        {item.name} <small className="text-muted">({item.abbreviation})</small>
                      </h5>
                      <p className="mb-1"><strong>Type:</strong> {item.type}</p>
                      <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
                      <p className="mb-1"><strong>Origin:</strong> {item.origin}</p>
                      <p className="mb-1"><strong>Doses Required:</strong> {item.dosesRequired}</p>
                </div>
              );
            })}
            </>
          )}
          {otherVax.length === 0 ? (
            <p className="text-muted">No vaccines found.</p>
          ) : (
            <>
            <h4 className="mb-4 mt-3 text-secondary border-bottom pb-2">
              Other Vaccines
            </h4>
            {otherVax.map((item, idx) => {
              const clickHandler = onSelect ? () => onSelect(item) : undefined;
              return (
                <div
                  key={idx}
                  onClick={clickHandler}
                  className={`border rounded p-3 mb-3 bg-light shadow-sm ${onSelect ? "clickable-item" : ""}`}
                  style={{ cursor: onSelect ? "pointer" : "default" }}
                >
                      <h5 className="mb-1">
                        {item.name} <small className="text-muted">({item.abbreviation})</small>
                      </h5>
                      <p className="mb-1"><strong>Type:</strong> {item.type}</p>
                      <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
                      <p className="mb-1"><strong>Origin:</strong> {item.origin}</p>
                      <p className="mb-1"><strong>Doses Required:</strong> {item.dosesRequired}</p>
                </div>
              );
            })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectableVaccineList;
