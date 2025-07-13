import React from "react";
import { BrowserRouter as Router} from "react-router-dom";
import AppContent from "./AppContent";

// Setup BrowserRouter Context
let App = (props) => {
  return (
      <Router basename="/">
        <AppContent/>
      </Router>
  );
};

export default App;