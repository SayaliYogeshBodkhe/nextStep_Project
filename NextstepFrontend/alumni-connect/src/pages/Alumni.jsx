import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./alumni.css";

function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedAlumni, setSelectedAlumni] =
    useState(null);

  const [connectAlumni, setConnectAlumni] =
    useState(null);

  const [message, setMessage] = useState("");

  /* ================= FETCH ALUMNI ================= */
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/getAlumni"
      );

      const data = await res.json();

      if (data.status === "ok") {
        setAlumni(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FILTER ================= */
  const filteredAlumni = alumni.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.company
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.position
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ================= SEND EMAIL ================= */
  const sendConnectionRequest = async () => {
    if (!message) {
      alert("Please enter message");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/sendConnectionMail",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            toEmail:
              connectAlumni.email,

            alumniName:
              connectAlumni.name,

            message:
              message,
          }),
        }
      );

      const data =
        await res.json();

      console.log(data);

      if (
        data.status === "ok"
      ) {
        alert(
          "Message Sent Successfully ✅"
        );

        setMessage("");

        setConnectAlumni(null);
      } else {
        alert(
          data.message
        );
      }
    } catch (err) {
      console.log(err);

      alert(
        "Failed to send message"
      );
    }
  };

  return (
    <>
      <Navbar />

      {/* SEARCH */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, company..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <button className="filter-btn">
          Search
        </button>
      </div>

      {/* CARDS */}
      <div className="container">
        {filteredAlumni.map(
          (item) => (
            <div
              className="card"
              key={item._id}
            >
              <div className="badge">
                Placed {item.year}
              </div>

              <img
                src={`http://localhost:5000/uploads/${item.photo}`}
                alt={item.name}
              />

              <h3>{item.name}</h3>

              <p>
                {item.position} @{" "}
                {item.company}
              </p>

              <span>
                {item.email}
              </span>

              <div className="skills">
                <span>
                  {item.company}
                </span>

                <span>
                  {item.position}
                </span>

                <span>
                  {item.year}
                </span>
              </div>

              <div className="buttons">
                <button
                  onClick={() =>
                    setSelectedAlumni(
                      item
                    )
                  }
                >
                  View Profile
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    setConnectAlumni(
                      item
                    )
                  }
                >
                  Connect
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* PROFILE POPUP */}
      {selectedAlumni && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button
              className="close-btn"
              onClick={() =>
                setSelectedAlumni(
                  null
                )
              }
            >
              ✖
            </button>

            <img
              src={`http://localhost:5000/uploads/${selectedAlumni.photo}`}
              alt={
                selectedAlumni.name
              }
              className="popup-img"
            />

            <h2>
              {
                selectedAlumni.name
              }
            </h2>

            <h4>
              {
                selectedAlumni.position
              }
            </h4>

            <p>
              <strong>
                Company:
              </strong>{" "}
              {
                selectedAlumni.company
              }
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {
                selectedAlumni.email
              }
            </p>

            <p>
              <strong>
                Batch:
              </strong>{" "}
              {
                selectedAlumni.year
              }
            </p>
          </div>
        </div>
      )}

      {/* CONNECT POPUP */}
      {connectAlumni && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button
              className="close-btn"
              onClick={() => {
                setConnectAlumni(
                  null
                );

                setMessage("");
              }}
            >
              ✖
            </button>

            <h2>
              Connect with{" "}
              {
                connectAlumni.name
              }
            </h2>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {
                connectAlumni.email
              }
            </p>

            <p>
              <strong>
                Company:
              </strong>{" "}
              {
                connectAlumni.company
              }
            </p>

            <p>
              <strong>
                Role:
              </strong>{" "}
              {
                connectAlumni.position
              }
            </p>

            <textarea
              placeholder="Write your message..."
              rows="4"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "15px",
                borderRadius: "8px",
              }}
            ></textarea>

            <button
              className="connect-btn"
              style={{
                marginTop: "15px",
              }}
              onClick={
                sendConnectionRequest
              }
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Alumni;