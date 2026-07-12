import React, { useEffect, useState } from "react";
import "./adminDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserGraduate,
  FaCalendarAlt,
  FaMapSigns,
  FaBook,
  FaBell,
  FaSignOutAlt
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  // ================= DATA STATES =================
  const [users, setUsers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);

  // ================= UI STATES =================
  const [showStudents, setShowStudents] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  

  // ================= FORMS =================
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
  const [roadmapForm, setRoadmapForm] = useState({
    role: "",
    company: "",
    category: "",
    location: "",
    year: "",
    icon: "",
    steps: [],
  });

  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    difficulty: "",
    thumbnail: "",
    link: "",
    tags: [],
  });

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
  });

  // ================= AUTH CHECK =================
  useEffect(() => {
    const role = localStorage.getItem("userType");

    if (!role) navigate("/login");
    else if (role !== "Admin") navigate("/");
  }, [navigate]);

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchUsers();
    fetchAlumni();
    fetchEvents();
    fetchRoadmaps();
    fetchResources();
    fetchNotifications();
  }, []);// ================= FETCH FUNCTIONS =================

const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/getUsers");
    const data = await res.json();

    if (data.status === "ok") {
      setUsers(data.data);
    }
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

const fetchAlumni = async () => {
  try {
    const res = await fetch("http://localhost:5000/getAlumni");
    const data = await res.json();

    if (data.status === "ok") {
      setAlumni(data.data);
    }
  } catch (err) {
    console.error("Error fetching alumni:", err);
  }
};

const fetchEvents = async () => {
  try {
    const res = await fetch("http://localhost:5000/getEvents");
    const data = await res.json();

    if (data.status === "ok") {
      setEvents(data.data);
    }
  } catch (err) {
    console.error("Error fetching events:", err);
  }
};

const fetchRoadmaps = async () => {
  try {
    const res = await fetch("http://localhost:5000/getRoadmaps");
    const data = await res.json();

    if (data.status === "ok") {
      setRoadmaps(data.data);
    }
  } catch (err) {
    console.error("Error fetching roadmaps:", err);
  }
};

const fetchResources = async () => {
  try {
    const res = await fetch("http://localhost:5000/getResources");
    const data = await res.json();

    if (data.status === "ok") {
      setResources(data.data);
    }
  } catch (err) {
    console.error("Error fetching resources:", err);
  }
};

const fetchNotifications = async () => {
  try {
    const res = await fetch("http://localhost:5000/getNotifications");
    const data = await res.json();

    if (data.status === "ok") {
      setNotifications(data.data);
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};
// ================= SAVE / UPDATE FUNCTIONS =================
const updateNotification = async () => {
  try {
    await fetch(`http://localhost:5000/updateNotification/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationForm),
    });

    fetchNotifications();
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);

    setNotificationForm({
      title: "",
      message: "",
    });
  } catch (err) {
    console.error("Error updating notification:", err);
  }
};

// Save Notification
const saveNotification = async () => {
  if (!notificationForm.title || !notificationForm.message) {
    alert("Fill both title and message");
    return;
  }

  try {
    await fetch("http://localhost:5000/addNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationForm),
    });

    fetchNotifications();

    setNotificationForm({
      title: "",
      message: "",
    });
  } catch (err) {
    console.error("Error saving notification:", err);
  }
};

// Save Alumni
const saveAlumni = async () => {
  try {
    const formData = new FormData();
    formData.append("name", alumniForm.name);
    formData.append("email", alumniForm.email);
    formData.append("company", alumniForm.company);
    formData.append("position", alumniForm.position);
    formData.append("year", alumniForm.year);

    if (alumniForm.photo) {
      formData.append("photo", alumniForm.photo);
    }

    await fetch("http://localhost:5000/addAlumni", {
      method: "POST",
      body: formData,
    });

    fetchAlumni();
    setShowModal(false);
  } catch (err) {
    console.error("Error saving alumni:", err);
  }
};
//Update Alumni
const updateAlumni = async () => {
  try {
    const formData = new FormData();
    formData.append("name", alumniForm.name);
    formData.append("email", alumniForm.email);
    formData.append("company", alumniForm.company);
    formData.append("position", alumniForm.position);
    formData.append("year", alumniForm.year);

    if (alumniForm.photo) {
      formData.append("photo", alumniForm.photo);
    }

    await fetch(`http://localhost:5000/updateAlumni/${editId}`, {
      method: "PUT",
      body: formData,
    });

    fetchAlumni();
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);
  } catch (err) {
    console.error("Error updating alumni:", err);
  }
};
//Update Event
const updateEvent = async () => {
  try {
    await fetch(`http://localhost:5000/updateEvent/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventForm),
    });

    fetchEvents();
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);

    setEventForm({
    title: "",
    date: "",
    time: "",
    mode: "",
    zoomLink: "",
  });
  } catch (err) {
    console.error("Error updating event:", err);
  }
};
// Save Event
const formatTime12hr = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h === 0 ? 12 : h;

  return `${h}:${minute} ${ampm}`;
};
const saveEvent = async () => {
  try {
    await fetch("http://localhost:5000/addEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventForm),
    });

    fetchEvents();
    setShowModal(false);
  } catch (err) {
    console.error("Error saving event:", err);
  }
};

// Update Roadmap
const updateRoadmap = async () => {
  try {
    await fetch(`http://localhost:5000/updateRoadmap/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roadmapForm),
    });

    fetchRoadmaps();
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);
  } catch (err) {
    console.error("Error updating roadmap:", err);
  }
};
// Save Roadmap
const saveRoadmap = async () => {
  try {
    await fetch("http://localhost:5000/addRoadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roadmapForm),
    });

    fetchRoadmaps();
    setShowModal(false);
  } catch (err) {
    console.error("Error saving roadmap:", err);
  }
};
//Update Resources
const updateResource = async () => {
  try {
    await fetch(`http://localhost:5000/updateResource/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceForm),
    });

    fetchResources();
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);
  } catch (err) {
    console.error("Error updating resource:", err);
  }
};
// Save Resource
const saveResource = async () => {
  try {
    await fetch("http://localhost:5000/addResource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceForm),
    });

    fetchResources();
    setShowModal(false);
  } catch (err) {
    console.error("Error saving resource:", err);
  }
};

// Update User
const updateUser = async () => {
  try {
    await fetch(`http://localhost:5000/updateUser/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userForm),
    });

    fetchUsers();
    setShowModal(false);
  } catch (err) {
    console.error("Error updating user:", err);
  }
};
// ================= DELETE FUNCTIONS =================

const deleteUser = async (id) => {
  try {
    await fetch(`http://localhost:5000/deleteUser/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
  }
};

const deleteAlumni = async (id) => {
  try {
    await fetch(`http://localhost:5000/deleteAlumni/${id}`, {
      method: "DELETE",
    });
    fetchAlumni();
  } catch (err) {
    console.error("Error deleting alumni:", err);
  }
};

const deleteEvent = async (id) => {
  try {
    await fetch(`http://localhost:5000/deleteEvent/${id}`, {
      method: "DELETE",
    });
    fetchEvents();
  } catch (err) {
    console.error("Error deleting event:", err);
  }
};

const deleteRoadmap = async (id) => {
  try {
    await fetch(`http://localhost:5000/deleteRoadmap/${id}`, {
      method: "DELETE",
    });
    fetchRoadmaps();
  } catch (err) {
    console.error("Error deleting roadmap:", err);
  }
};

const deleteResource = async (id) => {
  try {
    await fetch(`http://localhost:5000/deleteResource/${id}`, {
      method: "DELETE",
    });
    fetchResources();
  } catch (err) {
    console.error("Error deleting resource:", err);
  }
};

const deleteNotification = async (id) => {
  try {
    await fetch(`http://localhost:5000/deleteNotification/${id}`, {
      method: "DELETE",
    });
    fetchNotifications();
  } catch (err) {
    console.error("Error deleting notification:", err);
  }
};

// ================= HELPERS =================

// Logout
const handleLogout = () => {
  localStorage.removeItem("userType");
  navigate("/login");
};

// Edit Handler
const handleEdit = (data, type) => {
  setShowModal(true);
  setIsEdit(true);
  setEditId(data._id);

  if (type === "user") {
    setUserForm(data);
  }

  if (type === "alumni") {
    setAlumniForm({
      ...data,
      photo: null,
    });
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

  if (type === "roadmap") {
  setRoadmapForm({
    role: data.role || "",
    company: data.company || "",
    category: data.category || "",
    location: data.location || "",
    year: data.year || "",
    icon: data.icon || "",
    steps: data.steps || [],
  });
}

  if (type === "resource") {
  setResourceForm({
    title: data.title || "",
    description: data.description || "",
    category: data.category || "",
    type: data.type || "",
    difficulty: data.difficulty || "",
    thumbnail: data.thumbnail || "",
    link: data.link || "",
    tags: data.tags || [],
  });
}
  if (type === "notification") {
    setNotificationForm({
      title: data.title,
      message: data.message,
    });
  }
};

// Filter Users
const filteredUsers = users.filter((u) => {
  const matchSearch =
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase());

  const matchFilter =
    filter === "All" ? true : u.userType === filter;

  return matchSearch && matchFilter;
});

// Event Status
const getEventStatus = (event) => {
  if (event.meetingCompleted) return "COMPLETED";
  if (event.meetingLive) return "LIVE";
  return "UPCOMING";
};

// View Registered Students
const viewStudents = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/getEventStudents/${id}`
    );
    const data = await res.json();

    if (data.status === "ok") {
      setStudents(data.data);
      setShowStudents(true);
    }
  } catch (err) {
    console.error("Error fetching students:", err);
  }
};
return (
  <div className="admin-layout">
    {/* Sidebar */}
    <div className="sidebar">
  <h2>Admin Panel</h2>

  <ul>
    <li onClick={() => setActiveTab("users")}>
      <FaUsers /> Users
    </li>

    <li onClick={() => setActiveTab("alumni")}>
      <FaUserGraduate /> Alumni
    </li>

    <li onClick={() => setActiveTab("events")}>
      <FaCalendarAlt /> Events
    </li>

    <li onClick={() => setActiveTab("roadmaps")}>
      <FaMapSigns /> Roadmaps
    </li>

    <li onClick={() => setActiveTab("resources")}>
      <FaBook /> Resources
    </li>

    <li onClick={() => setActiveTab("notifications")}>
      <FaBell /> Notifications
    </li>

    <li onClick={handleLogout} style={{ color: "red" }}>
      <FaSignOutAlt /> Logout
    </li>
  </ul>
</div>

    {/* Main Content */}
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
                <th>Role</th>
                <th>Actions</th>
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
            setEditId(null);
            setAlumniForm({
              name: "",
              email: "",
              company: "",
              position: "",
              year: "",
              photo: null,
            });
          }}
          >
            + Add Alumni
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Position</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((a) => (
                <tr key={a._id}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.company}</td>
                  <td>{a.position}</td>
                  <td>{a.year}</td>
                  <td>
                    <button onClick={() => handleEdit(a, "alumni")}>Edit</button>
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
            setEditId(null);
            setEventForm({
            title: "",
            date: "",
            time: "",
            mode: "",
            zoomLink: "",
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id}>
                  <td>{e.title}</td>
                  <td>{e.date}</td>
                  <td>{formatTime12hr(e.time)}</td>
                  <td>{e.mode}</td>
                  <td>{getEventStatus(e)}</td>
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

      {/* ROADMAPS */}
      {activeTab === "roadmaps" && (
        <>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
            }}
          >
            + Add Roadmap
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Company</th>
                <th>Category</th>
                <th>Location</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roadmaps.map((r) => (
                <tr key={r._id}>
                  <td>{r.role}</td>
                  <td>{r.company}</td>
                  <td>{r.category}</td>
                  <td>{r.location}</td>
                  <td>{r.year}</td>
                  <td>
                    <button onClick={() => handleEdit(r, "roadmap")}>
                      Edit
                    </button>
                    <button onClick={() => deleteRoadmap(r._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* RESOURCES */}
      {activeTab === "resources" && (
        <>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
            }}
          >
            + Add Resource
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Difficulties</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r._id}>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td>{r.type}</td>
                  <td>{r.difficulty}</td>
                  <td>
                    <button onClick={() => handleEdit(r, "resource")}>
                      Edit
                    </button>
                    <button onClick={() => deleteResource(r._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === "notifications" && (
         <>
          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
            }}
          >
            + Add Notification
          </button>
          
          <div>  
            <table className="admin-table">
              <thead>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n._id}>
                    <td>{n.title}</td>
                    <td>{n.message}</td>
                    <td>
                      <button onClick={() => handleEdit(n, "notification")}>
                        Edit
                      </button>
                      <button onClick={() => deleteNotification(n._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
            {/* STUDENTS MODAL */}
      {showStudents && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Registered Students</h2>

            <table className="admin-table">
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

      {/* MAIN MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEdit ? "Edit" : "Add"}</h2>

            {/* USER */}
            {activeTab === "users" && (
              <>
                <input
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      email: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Phone"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      phone: e.target.value,
                    })
                  }
                />

                <select
                  value={userForm.userType}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      userType: e.target.value,
                    })
                  }
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>

                <button onClick={updateUser}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </>
            )}

            {/* ALUMNI */}
            {activeTab === "alumni" && (
              <>
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

                <input
                  placeholder="Company"
                  value={alumniForm.company}
                  onChange={(e) =>
                    setAlumniForm({ ...alumniForm, company: e.target.value })
                  }
                />

                <input
                  placeholder="Position"
                  value={alumniForm.position}
                  onChange={(e) =>
                    setAlumniForm({ ...alumniForm, position: e.target.value })
                  }
                />

                <input
                  placeholder="Year"
                  value={alumniForm.year}
                  onChange={(e) =>
                    setAlumniForm({ ...alumniForm, year: e.target.value })
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

                <button onClick={isEdit ? updateAlumni : saveAlumni}>
                  {isEdit ? "Update" : "Save"}
                </button>

                <button onClick={() => setShowModal(false)}>Cancel</button>
              </>
            )}

           {/* EVENTS */}
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

                {/* Show only for Online events */}
                {eventForm.mode === "Online" && (
                  <input
                    type="url"
                    placeholder="Enter Zoom Link"
                    value={eventForm.zoomLink}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        zoomLink: e.target.value,
                      })
                    }
                  />
                )}

                <button onClick={isEdit ? updateEvent : saveEvent}>
                  {isEdit ? "Update" : "Save"}
                </button>

                <button onClick={() => setShowModal(false)}>Cancel</button>
              </>
            )}
            {/* ROADMAPS */}
            {activeTab === "roadmaps" && (
              <>
                <input
                  placeholder="Role"
                  value={roadmapForm.role}
                  onChange={(e) =>
                    setRoadmapForm({
                      ...roadmapForm,
                      role: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Company"
                  value={roadmapForm.company}
                  onChange={(e) =>
                    setRoadmapForm({
                      ...roadmapForm,
                      company: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Steps (one per line)"
                  value={roadmapForm.steps.join("\n")}
                  onChange={(e) =>
                    setRoadmapForm({
                      ...roadmapForm,
                      steps: e.target.value.split("\n"),
                    })
                  }
                />
                <input
                  placeholder="Category"
                  value={roadmapForm.category}
                  onChange={(e) =>
                    setRoadmapForm({ ...roadmapForm, category: e.target.value })
                  }
                />

                <input
                  placeholder="Location"
                  value={roadmapForm.location}
                  onChange={(e) =>
                    setRoadmapForm({ ...roadmapForm, location: e.target.value })
                  }
                />

                <input
                  placeholder="Year"
                  value={roadmapForm.year}
                  onChange={(e) =>
                    setRoadmapForm({ ...roadmapForm, year: e.target.value })
                  }
                />
                <button onClick={isEdit ? updateRoadmap : saveRoadmap}>
                  {isEdit ? "Update" : "Save"}
                </button>
                <button onClick={() => setShowModal(false)}>Cancel</button>

              </>
            )}
            
           {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <>
                <div className="notification-panel">
                  <input
                    type="text"
                    placeholder="Title"
                    value={notificationForm.title}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        title: e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Message"
                    value={notificationForm.message}
                    onChange={(e) =>
                      setNotificationForm({
                        ...notificationForm,
                        message: e.target.value,
                      })
                    }
                  />

                  <button onClick={isEdit ? updateNotification : saveNotification}>
                    {isEdit ? "Update" : "Save"}
                  </button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>

                </div>
              </>
            )}
  
            {/* RESOURCES */}
          {activeTab === "resources" && (
          <>
            <input
              placeholder="Title"
              value={resourceForm.title}
              onChange={(e) =>
                setResourceForm({ ...resourceForm, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={resourceForm.description}
              onChange={(e) =>
                setResourceForm({
                  ...resourceForm,
                  description: e.target.value,
                })
              }
            />

            <input
              placeholder="Category"
              value={resourceForm.category}
              onChange={(e) =>
                setResourceForm({ ...resourceForm, category: e.target.value })
              }
            />

            <input
              placeholder="Type"
              value={resourceForm.type}
              onChange={(e) =>
                setResourceForm({ ...resourceForm, type: e.target.value })
              }
            />

            <input
              placeholder="Difficulty"
              value={resourceForm.difficulty}
              onChange={(e) =>
                setResourceForm({ ...resourceForm, difficulty: e.target.value })
              }
            />

            <input
              placeholder="Link"
              value={resourceForm.link}
              onChange={(e) =>
                setResourceForm({ ...resourceForm, link: e.target.value })
              }
            />

            <button onClick={isEdit ? updateResource : saveResource}>
              {isEdit ? "Update" : "Save"}
            </button>

            <button onClick={() => setShowModal(false)}>Cancel</button>
          </>
        )}

          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default AdminDashboard;