import React, { useEffect, useState } from "react";
import "./adminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);

  const [showStudents, setShowStudents] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("users");

  const navigate = useNavigate();

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "User",
  });

  const [alumniForm, setAlumniForm] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    year: "",
    photo: null,
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    mode: "",
    zoomLink: "",
  });

  // auth check
  useEffect(() => {
    const role = localStorage.getItem("userType");

    if (!role) navigate("/login");
    else if (role !== "Admin") navigate("/");
  }, [navigate]);

  // fetch data
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/getUsers");
    const data = await res.json();
    if (data.status === "ok") setUsers(data.data);
  };

  const fetchAlumni = async () => {
    const res = await fetch("http://localhost:5000/getAlumni");
    const data = await res.json();
    if (data.status === "ok") setAlumni(data.data);
  };

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/getEvents");
    const data = await res.json();
    if (data.status === "ok") setEvents(data.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchAlumni();
    fetchEvents();
  }, []);

  // delete
  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/deleteUser/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  const deleteAlumni = async (id) => {
    await fetch(`http://localhost:5000/deleteAlumni/${id}`, {
      method: "DELETE",
    });
    fetchAlumni();
  };

  const deleteEvent = async (id) => {
    const confirm = window.confirm("Delete this event?");
    if (!confirm) return;

    await fetch(`http://localhost:5000/deleteEvent/${id}`, {
      method: "DELETE",
    });
    fetchEvents();
  };

  // view students
  const viewStudents = async (id) => {
    const res = await fetch(`http://localhost:5000/getEventStudents/${id}`);
    const data = await res.json();

    if (data.status === "ok") {
      setStudents(data.data);
      setShowStudents(true);
    }
  };

  // edit
  const handleEdit = (data, type) => {
    setShowModal(true);
    setIsEdit(true);
    setEditId(data._id);

    if (type === "user") setUserForm(data);

    if (type === "alumni") {
      setAlumniForm({ ...data, photo: null });
    }

    if (type === "event") {
      setEventForm({
        title: data.title || "",
        date: data.date || "",
        time: data.time || "",
        mode: data.mode || "",
        zoomLink: data.zoomLink || "",
      });
    }
  };

  // update user
  const updateUser = async () => {
    await fetch(`http://localhost:5000/updateUser/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    fetchUsers();
    setShowModal(false);
  };

  // alumni save
  const saveAlumni = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", alumniForm.name);
    formData.append("email", alumniForm.email);
    formData.append("company", alumniForm.company);
    formData.append("position", alumniForm.position);
    formData.append("year", alumniForm.year);

    if (alumniForm.photo) {
      formData.append("photo", alumniForm.photo);
    }

    const url = isEdit
      ? `http://localhost:5000/updateAlumni/${editId}`
      : "http://localhost:5000/addAlumni";

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      body: formData,
    });

    fetchAlumni();
    setShowModal(false);
  };

  // event save
  const saveEvent = async () => {
    const url = isEdit
      ? `http://localhost:5000/updateEvent/${editId}`
      : "http://localhost:5000/addEvent";

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventForm),
    });

    fetchEvents();

    setEventForm({
      title: "",
      date: "",
      time: "",
      mode: "",
      zoomLink: "",
    });

    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/login");
  };

  // filter users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ? true : u.userType === filter;

    return matchSearch && matchFilter;
  });

  // EVENT STATUS
  const getEventStatus = (event) => {
    if (event.meetingCompleted) return "COMPLETED";
    if (event.meetingLive) return "LIVE";
    return "UPCOMING";
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveTab("users")}>Users</li>
          <li onClick={() => setActiveTab("alumni")}>Alumni</li>
          <li onClick={() => setActiveTab("events")}>Events</li>
          <li onClick={handleLogout} style={{ color: "red" }}>
            Logout
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <h1>{activeTab.toUpperCase()}</h1>

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>UserType</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.userType}</td>
                    <td>
                      <button onClick={() => handleEdit(u, "user")}>
                        Edit
                      </button>
                      <button onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ALUMNI */}
        {activeTab === "alumni" && (
          <>
            <button
              className="add-btn"
              onClick={() => {
                setShowModal(true);
                setIsEdit(false);
              }}
            >
              + Add Alumni
            </button>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Year</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {alumni.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${a.photo}`}
                        width="50"
                        alt=""
                      />
                    </td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.company}</td>
                    <td>{a.position}</td>
                    <td>{a.year}</td>
                    <td>
                      <button onClick={() => handleEdit(a, "alumni")}>
                        Edit
                      </button>
                      <button onClick={() => deleteAlumni(a._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <>
            <button
              className="add-btn"
              onClick={() => {
                setShowModal(true);
                setIsEdit(false);
              }}
            >
              + Add Event
            </button>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Meeting</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {events.map((e) => (
                  <tr key={e._id}>
                    <td>{e.title}</td>
                    <td>{e.date}</td>
                    <td>{e.time}</td>
                    <td>{e.mode}</td>

                    <td>
                      {getEventStatus(e)}
                    </td>

                    <td>
                      {e.mode === "Online" ? (
                        getEventStatus(e) === "LIVE" ? (
                          <a href={e.zoomLink} target="_blank">
                            <button style={{ background: "green", color: "#fff" }}>
                              Join
                            </button>
                          </a>
                        ) : getEventStatus(e) === "COMPLETED" ? (
                          <button disabled>Completed</button>
                        ) : (
                          <button disabled>Not Live</button>
                        )
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <button onClick={() => handleEdit(e, "event")}>
                        Edit
                      </button>
                      <button onClick={() => deleteEvent(e._id)}>
                        Delete
                      </button>
                      <button onClick={() => viewStudents(e._id)}>
                        Students
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* STUDENTS MODAL */}
      {showStudents && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Registered Students</h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={() => setShowStudents(false)}>Close</button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEdit ? "Edit" : "Add"}</h2>

            {activeTab === "users" && (
              <>
                <input
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                />
                <button onClick={updateUser}>Save</button>
              </>
            )}

            {activeTab === "alumni" && (
              <form onSubmit={saveAlumni}>
                <input
                  placeholder="Name"
                  value={alumniForm.name}
                  onChange={(e) =>
                    setAlumniForm({ ...alumniForm, name: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  value={alumniForm.email}
                  onChange={(e) =>
                    setAlumniForm({ ...alumniForm, email: e.target.value })
                  }
                />
                <button type="submit">Save</button>
              </form>
            )}

            {activeTab === "events" && (
              <>
                <input
                  placeholder="Title"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                />

                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                />

                <select
                  value={eventForm.mode}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, mode: e.target.value })
                  }
                >
                  <option value="">Select Mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>

                {eventForm.mode === "Online" && (
                  <input
                    placeholder="Zoom Link"
                    value={eventForm.zoomLink}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        zoomLink: e.target.value,
                      })
                    }
                  />
                )}

                <button onClick={saveEvent}>Save</button>
              </>
            )}

            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;