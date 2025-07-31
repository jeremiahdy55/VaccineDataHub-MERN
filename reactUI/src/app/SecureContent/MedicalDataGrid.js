import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getHospitals } from "../ReduxStore/Hospital/HospitalAction";
import { getVaccines } from "../ReduxStore/Vaccine/VaccineAction";

const MedicalDataGrid = () => {
  // hooks
  const dispatch = useDispatch();

  const hospitals =
    useSelector((state) => state.hospitalReducer.hospitals) || [];
  const vaccines = useSelector((state) => state.vaccineReducer.vaccines) || [];

  useEffect(() => {
    dispatch(getHospitals());
    dispatch(getVaccines());
  }, [dispatch]);

  return (
    <div className="container my-4" style={{ height: "66vh" }}>
      <div className="row h-100">
        {/* Hospitals Column */}
        <div className="col-md-6 mb-3 h-100">
          <div className="card border-primary h-100 d-flex flex-column">
            <div className="card-header bg-primary text-white fw-semibold">
              Hospitals
            </div>
            <div className="card-body overflow-auto">
              {hospitals.length === 0 ? (
                <p className="text-muted">No hospitals found.</p>
              ) : (
                hospitals.map((h, idx) => (
                  <div
                    key={idx}
                    className="border rounded p-3 mb-3 bg-light shadow-sm"
                  >
                    <h5 className="mb-1">{h.name}</h5>
                    <p className="mb-1 text-muted"><i>{h.address}</i></p>
                    <p className="mb-1">
                      <strong>Type:</strong> {h.type}
                    </p>
                    <p className="mb-0">
                      <strong>Service Charge:</strong> ${h.serviceCharge}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Vaccines Column */}
        <div className="col-md-6 mb-3 h-100">
          <div className="card border-success h-100 d-flex flex-column">
            <div className="card-header bg-success text-white fw-semibold">
              Vaccines
            </div>
            <div className="card-body overflow-auto">
              {vaccines.length === 0 ? (
                <p className="text-muted">No vaccines found.</p>
              ) : (
                vaccines.map((v, idx) => (
                  <div
                    key={idx}
                    className="border rounded p-3 mb-3 bg-light shadow-sm"
                  >
                    <h5 className="mb-1">
                      {v.name}{" "}
                      <small className="text-muted">[ {v.abbreviation} ]</small>
                    </h5>
                    <p className="mb-1">
                      <strong>Type:</strong> {v.type}
                    </p>
                    <p className="mb-1">
                      <strong>Price:</strong> ${v.price}
                    </p>
                    <p className="mb-1">
                      <strong>Origin:</strong> {v.origin}
                    </p>
                    <p className="mb-1">
                      <strong>Doses Required:</strong> {v.dosesRequired}
                    </p>
                    <p className="mb-1">
                      <strong>Recommended for Patient Age Group:</strong> {v.info?.recommendedAgeMin} - {v.info?.recommendedAgeMax}
                    </p>
                    {v.sideEffects?.length > 0 && (
                      <p className="mb-1">
                        <strong>Side Effects:</strong>{" "}
                        {v.sideEffects.join(", ")}
                      </p>
                    )}
                    {v.info?.strainsCovered?.length > 0 && (
                      <p className="mb-0">
                        <strong>Strains Covered:</strong>{" "}
                        {v.info.strainsCovered.join(", ")}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDataGrid;
