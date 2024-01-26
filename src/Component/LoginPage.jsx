import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Import the CSS file
import img from "./assets/vlogo.png";

import HomePage from "./HomePage"; 
import styled from "styled-components";
import Cookies from "js-cookie";


const ErrorMessage = styled.div`
  color: red;
  margin: 10px;
`;


const LoginPage = () => {
  
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null); // State to store user data after login
  const [isLoggedIn, setLoggedIn] = useState(false); // State to track login status


  const handleLogin = async () => {
  try {
    const response = await fetch("/api/pwa/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        user_password: password,
      }),
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData);
      setUserData(userData);
      setLoggedIn(true);

      // Store the token in localStorage
      Cookies.set("userToken", userData.token);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    setErrorMessage("An error occurred during login");
  }
};


  // Render the HomePage component if logged in
  if (isLoggedIn) {
    return <HomePage username={username} userData={userData}/>;
  }


  return (
    <div className="login-container">
      <img src={img} alt="Logo" className="logo" />

      <h6 style={{ fontSize: "20px", fontWeight: "200", color: "green" }}>
        Srinidhi Innovative InfoSoft Pvt Ltd
      </h6>
      <div className="input-container">
        <input placeholder="User name"  className="input-field"  type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="input-container">
        <input
          placeholder="Password:"
          type="password"
          className="input-field"
      
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <button className="login-button"  onClick={handleLogin}>
        <Link  className="button-link">
          Login
        </Link>
      </button>

      <Link to="/forgotPassword" className="forgot-password-link">
        Forgot Password?
      </Link>
    </div>
  );
};

export default LoginPage;
