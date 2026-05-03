import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // ✅ use state instead of direct localStorage
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  // ✅ update when localStorage changes
  useEffect(() => {
    const checkUser = () => {
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", checkUser);

    // also run once
    checkUser();

    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    setUserType(null); // 🔥 force UI update
    navigate("/login");
  };

  return (
    <div className="navbar">
      <img src={logo} alt="logo" width="40" />

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/roadmap">Roadmap</Link>
        <Link to="/alumni">Alumni</Link>
        <Link to="/about">About</Link>

        {/* ✅ FIXED */}
        {userType ? (
          <span
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "red" }}
          >
            Logout
          </span>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;