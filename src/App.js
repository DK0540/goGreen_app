import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Component/LoginPage";
import PopupForm from "./Component/PopupForm";
import HomePage from "./Component/HomePage";

const App = () => {
  return (
    <Router basename="/pwaApp">
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/popup" element={<PopupForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
