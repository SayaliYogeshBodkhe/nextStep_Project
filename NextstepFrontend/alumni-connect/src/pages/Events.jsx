import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] =
  useState(1);

const itemsPerPage = 6;

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* ================= FETCH EVENTS ================= */
  const fetchEvents = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/getEvents"
      );

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
  const lastIndex =
  currentPage * itemsPerPage;

const firstIndex =
  lastIndex - itemsPerPage;

const currentItems =
  events.slice(
    firstIndex,
    lastIndex
  );

const totalPages = Math.ceil(
  events.length / itemsPerPage
);

  /* ================= OPEN POPUP ================= */
  const openPopup = (event) => {
    setSelectedEvent(event.title);
    setSelectedEventId(event._id);
    setShowPopup(true);
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* ================= REGISTER EVENT ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/registerEvent",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            eventId:
              selectedEventId,
            eventTitle:
              selectedEvent,
            name: formData.name,
            email:
              formData.email,
            phone:
              formData.phone,
          }),
        }
      );

      const data =
        await res.json();

      if (data.status === "ok") {
        alert(
          "Registered Successfully ✅"
        );

        setShowPopup(false);

        setFormData({
          name: "",
          email: "",
          phone: "",
        });
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

      {/* HEADER */}
      <div className="header">
        <h1>
          Upcoming Tech Events 🚀
        </h1>
      </div>

      {/* EVENTS */}
      <div className="events-container">
        {events.length > 0 ? (
          currentItems.map((event) => (
            <div
              className="event-card"
              key={event._id}
            >
              <h3>
                {event.title}
              </h3>

              <p>
                📅 Date:{" "}
                {event.date}
              </p>

              <p>
                ⏰ Time:{" "}
                {event.time}
              </p>

              <p>
                📍 Mode:{" "}
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
          ))
        ) : (
          <h2
            style={{
              textAlign:
                "center",
              width: "100%",
            }}
          >
            No Events Found
          </h2>
        )}
      </div>
      <div className="pagination">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
  >
    Prev
  </button>

  {[...Array(totalPages)].map(
    (_, index) => (
      <button
        key={index}
        className={
          currentPage === index + 1
            ? "active-page"
            : ""
        }
        onClick={() =>
          setCurrentPage(index + 1)
        }
      >
        {index + 1}
      </button>
    )
  )}

  <button
    disabled={
      currentPage === totalPages
    }
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
  >
    Next
  </button>

</div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>
              Register Event
            </h2>

            <h3>
              {selectedEvent}
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

              <div className="popup-btns">
                <button type="submit">
                  Submit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowPopup(
                      false
                    )
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

export default Events;