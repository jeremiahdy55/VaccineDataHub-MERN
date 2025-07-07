import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Navbar from "./Navbar";
import Login from "./AuthComponents/Login";
import RegisterUser from "./AuthComponents/RegisterUser";
// import Login from "./UnauthorizedAccess/Login";
// import RegisterUser from "./UnauthorizedAccess/RegisterUser";
// import Home from "./AuthorizedAccess/Home";
// import PrivateRoute from "./AuthorizedAccess/PrivateRoute";
// import Booking from "./AuthorizedAccess/Booking";

let App = (props) => {
  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          {/* <Route path="/admin" element={<h4>admin page</h4>} /> */}
        </Routes>
      </Router>
    </>
  );
};
export default App;
