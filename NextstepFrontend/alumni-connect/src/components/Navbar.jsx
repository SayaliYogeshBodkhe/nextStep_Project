import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const BASE_URL = "https://nextstep-project-rqyg.onrender.com";
  // deployed असल्यास:
  // const BASE_URL = "https://https://nextstep-project-rqyg.onrender.com";

  /* USER */
  const [userType, setUserType] = useState(
    localStorage.getItem("userType")
  );

  /* NOTIFICATION */
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  /* FETCH NOTIFICATIONS */
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getNotifications`);
      const data = await res.json();

      if (data && data.status === "ok") {
        setNotifications(data.data || []);
      }
    } catch (err) {
      console.log("Fetch notification error:", err);
    }
  };

  /* SOCKET + INITIAL LOAD */
  useEffect(() => {
    fetchNotifications();

    socketRef.current = io(BASE_URL);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("newNotification", (data) => {
      console.log("New notification:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    const checkUser = () => {
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", checkUser);
    checkUser();

    return () => {
      window.removeEventListener("storage", checkUser);

      if (socketRef.current) {
        socketRef.current.off("newNotification");
        socketRef.current.disconnect();
      }
    };
  }, []);

  /* OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("userType");
    setUserType(null);
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* LOGO */}
      <img src={logo} alt="logo" width="45" />

      {/* LINKS */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/roadmap">Roadmap</Link>
        <Link to="/alumni">Alumni</Link>
        <Link to="/about">About</Link>

        {/* NOTIFICATION */}
        <div
          className="notification-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          {/* BELL */}
          <button
            className="bell-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            🔔
          </button>

          {/* COUNT */}
          {notifications.length > 0 && (
            <span className="notification-count">
              {notifications.length}
            </span>
          )}

          {/* BOX */}
         {showNotifications && (
          <div className="notification-box">
            <div className="notification-header">
              <h3>🔔 Notifications</h3>
              <button
                className="close-notification-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(false);
                }}
              >
                ✕
              </button>
            </div>
            
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div className="notification-item" key={n._id}>
                  <div className="notification-icon">📢</div>
                  <div className="notification-content">
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-notification">No Notifications</p>
            )}
          </div>
        )}
        </div>

        {/* LOGIN / LOGOUT */}
        {userType ? (
          <span
            onClick={handleLogout}
            className="logout-btn"
            style={{
              cursor: "pointer",
              color: "#ff4d4d",
              fontWeight: "600",
            }}
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