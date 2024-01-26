import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./Component/LoginPage";
import PopupForm from "./Component/PopupForm";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/popup" element={<PopupForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
