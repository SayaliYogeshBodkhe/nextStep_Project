
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* SEND OTP */
  const sendOtp = async () => {
    if (!formData.email.trim()) {
      alert("Enter Email First");
      return;
    }

    if (!API_URL) {
      alert("Backend API URL is missing!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "ok") {
        alert("OTP Sent Successfully");
        setOtpSent(true);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      alert("Unable to connect to the server.");
    }
  };

  /* SIGNUP */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select User Type");
      return;
    }

    if (userType === "Admin" && !secretKey) {
      alert("Enter Admin Secret Key");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    if (!API_URL) {
      alert("Backend API URL is missing!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/verifyOtpSignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType,
          secretKey,
          otp,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          gender: formData.gender,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "ok") {
        alert("Signup Successful");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="signup-container">
        <div className="signup-left">
          <img src={logo} alt="Logo" />
        </div>

        <div className="signup-right">
          <h2>Welcome To NextStep</h2>

          <div className="radio-group">
            <label>Register As:</label>

            <label>
              <input
                type="radio"
                value="User"
                checked={userType === "User"}
                onChange={(e) => setUserType(e.target.value)}
              />
              User
            </label>

            <label>
              <input
                type="radio"
                value="Admin"
                checked={userType === "Admin"}
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </label>
          </div>

          {userType === "Admin" && (
            <input
              type="password"
              placeholder="Enter Admin Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Enter Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
            >
              Send OTP
            </button>

            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <span onClick={() => setShowPassword(!showPassword)}>
                👁️
              </span>
            </div>

            <div className="password-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                👁️
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
