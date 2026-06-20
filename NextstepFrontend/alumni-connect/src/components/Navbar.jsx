import { Link, useNavigate } from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import logo from "../assets/logo.png";

import "./Navbar.css";

function Navbar() {

  const navigate =
    useNavigate();

  /* USER */

  const [userType,
    setUserType] =
    useState(
      localStorage.getItem(
        "userType"
      )
    );

  /* NOTIFICATION */

  const [notifications,
    setNotifications] =
    useState([]);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  /* FETCH NOTIFICATION */

  const fetchNotifications =
    async () => {

      try {

        const res =
         await fetch("https://nextstep-project-1.onrender.com/getNotifications");

        const data =
          await res.json();

        if (
          data.status === "ok"
        ) {

          setNotifications(
            data.data
          );
        }

      } catch (err) {

        console.log(err);
      }
  };

  /* USE EFFECT */

  useEffect(() => {

    fetchNotifications();

    const checkUser = () => {

      setUserType(
        localStorage.getItem(
          "userType"
        )
      );
    };

    window.addEventListener(
      "storage",
      checkUser
    );

    checkUser();

    return () =>
      window.removeEventListener(
        "storage",
        checkUser
      );

  }, []);

  /* LOGOUT */

  const handleLogout = () => {

    localStorage.removeItem(
      "userType"
    );

    setUserType(null);

    navigate("/login");
  };

  return (

    <div className="navbar">

      {/* LOGO */}

      <img
        src={logo}
        alt="logo"
        width="45"
      />

      {/* LINKS */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/events">
          Events
        </Link>

        <Link to="/resources">
          Resources
        </Link>

        <Link to="/roadmap">
          Roadmap
        </Link>

        <Link to="/alumni">
          Alumni
        </Link>

        <Link to="/about">
          About
        </Link>

        {/* BELL */}

        <div className="notification-wrapper">

          <button
            className="bell-btn"

            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            🔔
          </button>

          {notifications.length > 0 && (

            <span className="notification-count">

              {notifications.length}

            </span>

          )}

          {showNotifications && (

            <div className="notification-box">

              <h3 className="notification-title">

                Notifications

              </h3>

              {notifications.length > 0 ? (

                notifications.map((n) => (

                  <div
                    className="notification-item"
                    key={n._id}
                  >

                    <h4>
                      {n.title}
                    </h4>

                    <p>
                      {n.message}
                    </p>

                  </div>

                ))

              ) : (

                <p className="empty-notification">

                  No Notifications

                </p>

              )}

            </div>

          )}

        </div>

        {/* LOGIN LOGOUT */}

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

          <Link to="/login">
            Login
          </Link>

        )}

      </div>

    </div>
  );
}

export default Navbar;