
import Navbar from "../components/Navbar";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!API_URL) {
      alert("Server URL is not configured.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok) {
        alert("Login successful!");

        const role = data.userType;
        localStorage.setItem("userType", role);

        if (role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-box">
          <h2>Login to your account</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="google"
            onClick={() => {
              window.open(`${API_URL}/auth/google`, "_self");
            }}
          >
            Continue with Google
          </button>

          <p>
            Don't have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
