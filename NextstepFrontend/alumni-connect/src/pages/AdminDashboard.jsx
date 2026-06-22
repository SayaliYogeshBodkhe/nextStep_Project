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
  });

  const navigate = useNavigate();

  /* AUTH */
  useEffect(() => {
    const role = localStorage.getItem("userType");

    if (!role) navigate("/login");
    else if (role !== "Admin") navigate("/");
  }, [navigate]);

  /* FETCH */
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
  console.log("Users API:", data); // check this
    if (data.status === "ok") setEvents(data.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchAlumni();
    fetchEvents();
  }, []);

  /* DELETE */
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
    await fetch(`http://localhost:5000/deleteEvent/${id}`, {
      method: "DELETE",
    });
    fetchEvents();
  };

  /* VIEW STUDENTS */
  const viewStudents = async (id) => {
    const res = await fetch(
      `http://localhost:5000/getEventStudents/${id}`
    );
    const data = await res.json();

    if (data.status === "ok") {
      setStudents(data.data);
      setShowStudents(true);
    }
  };

  /* EDIT */
  const handleEdit = (data, type) => {
    setShowModal(true);
    setIsEdit(true);
    setEditId(data._id);

    if (type === "user") setUserForm(data);

    if (type === "alumni") {
      setAlumniForm({
        ...data,
        photo: null,
      });
    }

    if (type === "event") setEventForm(data);
  };

  /* UPDATE USER */
  const updateUser = async () => {
    await fetch(`http://localhost:5000/updateUser/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    fetchUsers();
    setShowModal(false);
  };

  /* SAVE ALUMNI */
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

  /* SAVE EVENT */
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
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ? true : u.userType === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout">
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

      <div className="main-content">
        <h1>{activeTab.toUpperCase()}</h1>

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <input
              type="text"
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
                setEventForm({
                  title: "",
                  date: "",
                  time: "",
                  mode: "",
                });
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

            <button onClick={() => setShowStudents(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {activeTab === "users" && (
              <>
                <h2>Edit User</h2>
                <input
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                />
                <button onClick={updateUser}>Save</button>
              </>
            )}

            {activeTab === "alumni" && (
              <form onSubmit={saveAlumni}>
                <h2>{isEdit ? "Edit Alumni" : "Add Alumni"}</h2>

                <input
                  placeholder="Name"
                  value={alumniForm.name}
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Email"
                  value={alumniForm.email}
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Company"
                  value={alumniForm.company}
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      company: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Position"
                  value={alumniForm.position}
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      position: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Year"
                  value={alumniForm.year}
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      year: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      photo: e.target.files[0],
                    })
                  }
                />

                <button type="submit">Save</button>
              </form>
            )}

            {activeTab === "events" && (
              <>
                <h2>{isEdit ? "Edit Event" : "Add Event"}</h2>

                <input
                  placeholder="Title"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      date: e.target.value,
                    })
                  }
                />

                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      time: e.target.value,
                    })
                  }
                />

                <select
                  value={eventForm.mode}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      mode: e.target.value,
                    })
                  }
                >
                  <option value="">Select Mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>

                <button onClick={saveEvent}>Save</button>
              </>
            )}

            <button onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;