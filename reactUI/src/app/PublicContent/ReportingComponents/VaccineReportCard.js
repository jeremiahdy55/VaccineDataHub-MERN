import React from "react";

const VaccineReportCard = ({ name, oneDosePercent, fullDosePercent }) => {
  return (
    <div className="vaccine-reporting-card">
      <h6 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "0.5rem" }}>
        {name}
      </h6>

      <div style={{ marginTop: "auto", textAlign: "center" }}>
        <p style={{ margin: 0 }}>
          At least one dose: <i>{oneDosePercent.toFixed(2)}%</i>
        </p>
        <p style={{ margin: 0 }}>
          Fully vaccinated: <strong>{fullDosePercent.toFixed(2)}%</strong>
        </p>
      </div>
    </div>
  );
};
export default VaccineReportCard;