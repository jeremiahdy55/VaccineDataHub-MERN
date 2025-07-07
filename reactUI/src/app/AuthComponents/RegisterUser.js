import React, { useState } from "react";
// import { register } from "../HTTPComms/UserAuth";
import { useNavigate } from "react-router-dom";

// Simple register user page
// NOTE: THIS DOES NOT LOGIN THE USER, JUST CREATES THEM IN DB
const RegisterUser = () => {
  // Define necessary hooks
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password });
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  return (
    <div>
      <div className="mt-5 container d-flex justify-content-center">
        <div className="card p-4 shadow w-50">
          <h2 className="text-center">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
