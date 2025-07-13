import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../ReduxStore/UserAuth/UserAction";
// import { login } from "../HTTPComms/UserAuth";

// Simple login page
const Login = () => {
  // Declare necessary hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(username, password));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed: Invalid username or password");
    }
  };

  return (
    <div className="mt-5 container d-flex justify-content-center">
      <div className="card p-4 shadow w-50">
      <div className="bg-success text-white p-3 rounded mb-4 text-center">
          <h2 className="mb-0">Login Portal</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label"><strong>Username:</strong></label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Password:</strong></label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/register" className="text-decoration-none">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
