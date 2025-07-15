import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerVaccine } from "../../ReduxStore/Vaccine/VaccineAction";

const VACCINE_TYPES = [
  "mRNA",
  "Viral Vector",
  "Inactivated",
  "Live Attenuated",
  "Protein Subunit",
  "DNA-Based",
  "Toxoid",
  "Other",
];

const RegisterVaccineForm = () => {
    
// hooks
const dispatch = useDispatch();
const navigate = useNavigate();

// track the form's state
  const [form, setForm] = useState({
    name: "",
    abbreviation: "",
    type: "",
    price: "",
    origin: "",
    dosesRequired: "",
    sideEffects: [],
    strainsCovered: [],
  });

  // string arrays in the forms
  const [sideEffectInput, setSideEffectInput] = useState("");
  const [strainInput, setStrainInput] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSideEffect = () => {
    if (sideEffectInput.trim()) {
      setForm((prev) => ({
        ...prev,
        sideEffects: [...prev.sideEffects, sideEffectInput.trim()],
      }));
      setSideEffectInput("");
    }
  };

  const addStrain = () => {
    if (strainInput.trim()) {
      setForm((prev) => ({
        ...prev,
        strainsCovered: [...prev.strainsCovered, strainInput.trim()],
      }));
      setStrainInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vaccinePayload = {
      name: form.name.trim(),
      abbreviation: form.abbreviation.trim(),
      type: form.type,
      price: parseFloat(form.price),
      origin: form.origin.trim(),
      dosesRequired: parseInt(form.dosesRequired),
      sideEffects: form.sideEffects,
      info: { strainsCovered: form.strainsCovered },
    };
    try {
        await dispatch(registerVaccine(vaccinePayload));
        navigate("/admin");
    } catch (err) {
        alert("Vaccine registration failed: " + err);
        console.error("Vaccine registration failed", err);
    }
  };

  return (
    <div className="mt-5 container d-flex justify-content-center">
      <div className="card p-4 w-75">
        <div className="bg-success text-white p-3 rounded mb-4 text-center">
          <h2 className="mb-0">Register Vaccine</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Basic Fields */}
          <div className="row mb-3">
            <div className="col">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label>Abbreviation:</label>
              <input
                type="text"
                name="abbreviation"
                className="form-control"
                value={form.abbreviation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label>Type:</label>
              <select
                name="type"
                className="form-select"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                {VACCINE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Price (USD):</label>
              <input
                type="number"
                name="price"
                className="form-control"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label>Doses Required:</label>
              <input
                type="number"
                name="dosesRequired"
                className="form-control"
                min="1"
                value={form.dosesRequired}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Origin (e.g., USA, Germany):</label>
            <input
              type="text"
              name="origin"
              className="form-control"
              value={form.origin}
              onChange={handleChange}
              required
            />
          </div>

          {/* Side Effects */}
          <div className="mb-3">
            <label><strong>Side Effects:</strong></label>
            <div className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="e.g., Fever"
                value={sideEffectInput}
                onChange={(e) => setSideEffectInput(e.target.value)}
              />
              <button type="button" className="btn btn-outline-primary" onClick={addSideEffect}>
                Add
              </button>
            </div>
            {form.sideEffects.length > 0 && (
              <div>{form.sideEffects.join(", ")}</div>
            )}
          </div>

          {/* Strains Covered */}
          <div className="mb-3">
            <label><strong>Strains Covered:</strong></label>
            <div className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="e.g., COVID-19"
                value={strainInput}
                onChange={(e) => setStrainInput(e.target.value)}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={addStrain}>
                Add
              </button>
            </div>
            {form.strainsCovered.length > 0 && (
              <div>{form.strainsCovered.join(", ")}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            <strong>Register Vaccine</strong>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterVaccineForm;
