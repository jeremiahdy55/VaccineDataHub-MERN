import React from "react";

const EthnicityColumn = ({ options, selectedEthnicities, onToggle }) => {
  return (
    <div className="col-6">
      {options.map((option) => (
        <div className="form-check" key={option}>
          <input
            type="checkbox"
            className="form-check-input"
            id={option}
            value={option}
            checked={selectedEthnicities.includes(option)}
            onChange={(e) => onToggle(option, e.target.checked)}
          />
          <label className="form-check-label" htmlFor={option}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default EthnicityColumn;