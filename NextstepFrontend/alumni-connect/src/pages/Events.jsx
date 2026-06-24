import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* ================= FETCH EVENTS ================= */
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/getEvents");
      const data = await res.json();

      if (data.status === "ok") {
        setEvents(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= OPEN POPUP ================= */
  const openPopup = (event) => {
    setSelectedEvent(event);
    setSelectedEventId(event._id);
    setShowPopup(true);
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/registerEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEventId,
          eventTitle: selectedEvent?.title,
          date: selectedEvent?.date,
          time: selectedEvent?.time,
          zoomLink: selectedEvent?.zoomLink,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        alert("Registered Successfully ✅");
        setShowPopup(false);
        setFormData({ name: "", email: "", phone: "" });
      } else {
        alert("Registration Failed ❌");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error ❌");
    }
  };

  /* ================= EVENT STATUS ================= */
  const getEventStatus = (event) => {
    const now = new Date();
    const start = new Date(`${event.date}T${event.time}`);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    if (now >= start && now < end) return "LIVE";
    if (now >= end) return "COMPLETED";
    return "UPCOMING";
  };

  return (
    <>
      <Navbar />

      <div className="header">
        <h1>Upcoming Tech Events 🚀</h1>
      </div>

      <div className="events-container">
        {events.length > 0 ? (
          events.map((event) => {
            const status = getEventStatus(event);

            return (
              <div className="event-card" key={event._id}>
                <h3>{event.title}</h3>

                <p>📅 Date: {event.date}</p>
                <p>⏰ Time: {new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}</p>
                <p>📍 Mode: {event.mode}</p>

                {/* ================= STATUS BUTTONS ================= */}

                {status === "UPCOMING" && (
                  <button onClick={() => openPopup(event)}>
                    Register
                  </button>
                )}

                {status === "LIVE" && (
                  <a href={event.zoomLink} target="_blank" rel="noreferrer">
                    <button style={{ background: "green", color: "white" }}>
                      🔴 Join Now
                    </button>
                  </a>
                )}

                {status === "COMPLETED" && (
                  <button disabled style={{ background: "gray", color: "white" }}>
                    ✅ Completed
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <h2 style={{ textAlign: "center", width: "100%" }}>
            No Events Found
          </h2>
        )}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Register Event</h2>

            <h3>{selectedEvent?.title}</h3>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
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

              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <div className="popup-btns">
                <button type="submit">Submit</button>

                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
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

export default Events;