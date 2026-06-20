import Navbar from "../components/Navbar";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://nextstep-project-1.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok) {
        alert("Login successful ✅");

        const role = data.userType; // "Admin" or "User"

        // Save role in localStorage
        localStorage.setItem("userType", role);

        // Redirect based on role
        if (role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }

      } else {
        alert(data.message || "Login failed ❌");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server error ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-box">
          <h2>Login to your account</h2>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />

            {/* Login Button */}
            <button type="submit">Login</button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Social Buttons */}
         <button
          className="google"
          onClick={() => {
            window.open("https://nextstep-project-1.onrender.com/auth/google", "_self");
          }}
          >
          Continue with Google
        </button>
         

          {/* Signup Link */}
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