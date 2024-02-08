import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Component/LoginPage";
import PopupForm from "./Component/PopupForm";
import HomePage from "./Component/HomePage";
import UserProfile from "./Component/UserProfile";

const App = () => {
  const [userName, setUserName] = useState("");
  return (
    <Router basename="/pwaApp">
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={<HomePage userName={userName} setUserName={setUserName} />}
          />
          <Route path="/popup" element={<PopupForm />} />
          <Route
            path="/user"
            element={
              <UserProfile userName={userName} setUserName={setUserName} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
