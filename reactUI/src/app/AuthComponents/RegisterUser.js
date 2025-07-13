import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EthnicityColumn from "./RegisterFormComponents/EthnicityColumn";
import FormInput from "./RegisterFormComponents/FormInput";
import { registerUser } from "../ReduxStore/UserAuth/UserAction";

const RegisterUser = () => {
  // define hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    profession: "",
    email: "",
    phoneNo: "",
    age: "",
    gender: "",
    ethnicity: [],
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    medicalHistory: [],
  });

  const [medicalHistoryInput, setMedicalHistoryInput] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);

  const ETH_LEFT_COLUMN = [
    "American Indian or Alaska Native",
    "Asian - East Asian",
    "Asian - South Asian",
    "Asian - Southeast Asian",
    "Black or African American",
    "Hispanic or Latino",
  ];

  const ETH_RIGHT_COLUMN = [
    "Middle Eastern or North African (MENA)",
    "Native Hawaiian or Other Pacific Islander",
    "White",
    "Multiracial or Multiethnic",
    "Other",
    "Prefer not to say",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleEthnicity = (option, checked) => {
    setForm((prev) => {
      const selected = prev.ethnicity;
      const updated = checked
        ? [...selected, option]
        : selected.filter((eth) => eth !== option);
      return { ...prev, ethnicity: updated };
    });
  };

  const addMedicalHistoryItem = () => {
    const trimmed = medicalHistoryInput.trim();
    if (trimmed && !medicalHistory.includes(trimmed)) {
      setMedicalHistory((prev) => [...prev, trimmed]);
    }
    setMedicalHistoryInput("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // === Validation rules ===
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

    // ethnicity must not be empty
    if (form.ethnicity.length === 0) {
      alert("Please select at least one ethnicity.");
      return;
    }

    // phone number must be exactly 10 digits
    if (!phoneRegex.test(form.phoneNo)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // email address must match email regex
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // must select a gender option
    if (!form.gender) {
      alert("Please select a gender.");
      return;
    }

    // === Reformat data to fit MongoDB schema ===
    // flatten address into a single string
    const flatAddress = [
      form.address.line1,
      form.address.line2,
      form.address.city,
      form.address.state,
      form.address.zipCode,
    ]
      .filter(Boolean) // removes empty values like line2 if blank
      .join(", ");

    // Add medical history and flat address 
    const submitData = {
      ...form,
      address: flatAddress,
      medicalHistory: medicalHistory,
    };

    // === Send the data to register user to nodeAPI ===
    try {
      await dispatch(registerUser(submitData)); // Replace with actual request
      console.log("Form submitted:", submitData);
      navigate("/");
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  return (
    <div className="mt-5 container d-flex justify-content-center">
      <div className="card p-4 w-75">
        <div className="bg-success text-white p-3 rounded mb-4 text-center">
          <h2 className="mb-0">Register Form</h2>
        </div>
        <form onSubmit={handleRegister}>
          {/* Account Info */}
          <div className="row mb-3">
            <div className="col">
              <FormInput
                label="Username:"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <FormInput
                label="Password:"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Personal Info */}
          <div className="row mb-3">
            <div className="col">
              <FormInput
                label="Name:"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <FormInput
                label="Profession:"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <FormInput
                label="Email:"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <FormInput
                label="Phone Number (ex. 8001234567):"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <FormInput
                label="Age:"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <label>
                <strong>Gender:</strong>
              </label>
              <div>
                {["Male", "Female", "Nonbinary", "Other"].map((g) => (
                  <div className="form-check form-check-inline" key={g}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{g}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address Fields */}
          <FormInput
            label="Address Line 1:"
            name="address.line1"
            value={form.address.line1}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Address Line 2:"
            name="address.line2"
            value={form.address.line2}
            onChange={handleChange}
          />
          <div className="row mb-3">
            <div className="col">
              <FormInput
                label="City:"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <FormInput
                label="State:"
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <FormInput
                label="Zip Code:"
                name="address.zipCode"
                type="number"
                value={form.address.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <strong>Ethnicity (check all that apply):</strong>
            </label>
            <div className="row">
              <EthnicityColumn
                options={ETH_LEFT_COLUMN}
                selectedEthnicities={form.ethnicity}
                onToggle={toggleEthnicity}
              />
              <EthnicityColumn
                options={ETH_RIGHT_COLUMN}
                selectedEthnicities={form.ethnicity}
                onToggle={toggleEthnicity}
              />
            </div>
          </div>

          <div className="mb-3">
            <label>
              <strong>Medical History:</strong>
            </label>
            <div className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={medicalHistoryInput}
                onChange={(e) => setMedicalHistoryInput(e.target.value)}
                placeholder="Type medical history item"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={addMedicalHistoryItem}
              >
                Add
              </button>
            </div>
            {medicalHistory.length > 0 && (
              <div>{medicalHistory.join(", ")}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            <strong>Register</strong>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
