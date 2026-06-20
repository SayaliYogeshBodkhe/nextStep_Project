import Navbar from "../components/Navbar";
import "./home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [events, setEvents] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const res = await axios.get(
        "https://nextstep-project-1.onrender.com/getEvents"
      );

      if (res.data.status === "ok") {
        setEvents(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* OPEN POPUP */
  const openPopup = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  /* CLOSE POPUP */
  const closePopup = () => {
    setShowPopup(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  /* INPUT CHANGE */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* REGISTER EVENT */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://nextstep-project-1.onrender.com/registerEvent",
        {
          eventId:
            selectedEvent._id,

          eventTitle:
            selectedEvent.title,   // ✅ IMPORTANT

          name: formData.name,
          email:
            formData.email,
          phone:
            formData.phone,
        }
      );

      if (
        res.data.status === "ok"
      ) {
        alert(
          "Registered Successfully ✅\nEmail Sent 📧"
        );

        closePopup();
      } else {
        alert(
          "Registration Failed ❌"
        );
      }
    } catch (error) {
      console.log(error);

      alert("Server Error ❌");
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="hero">
        <h1>
          Get Placement Ready
          with Alumni Guidance
        </h1>

        <p>
          Join events, learn
          skills and connect
          with alumni
        </p>

        <Link to="/events">
          <button>
            Explore Events
          </button>
        </Link>
      </div>

      {/* EVENTS */}
      <div className="events">
        <h2>
          Upcoming Events
        </h2>

        <div className="cards">
          {events
            .slice(0, 3)
            .map((event) => (
              <div
                className="card"
                key={event._id}
              >
                <h3>
                  {event.title}
                </h3>

                <p>
                  Date:
                  {event.date}
                </p>

                <p>
                  Time:
                  {event.time}
                </p>

                <p>
                  Mode:
                  {event.mode}
                </p>

                <button
                  onClick={() =>
                    openPopup(
                      event
                    )
                  }
                >
                  Register
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>
              Register Event
            </h2>

            <h3>
              {
                selectedEvent.title
              }
            </h3>

            <form
              onSubmit={
                handleRegister
              }
            >
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                required
              />

              <div className="popup-buttons">
                <button
                  type="submit"
                  className="submit-btn"
                >
                  Submit
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closePopup
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;