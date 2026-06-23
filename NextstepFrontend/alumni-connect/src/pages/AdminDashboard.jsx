import React, { useEffect, useState } from "react";
import "./adminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [resources, setResources] = useState([]);

  const [showStudents, setShowStudents] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("users");

  /* ================= ROADMAP ================= */
  const [roadmapData, setRoadmapData] = useState({
    role: "",
    category: "",
    icon: "",
    company: "",
    location: "",
    year: "",
    description: "",
    duration: "",
    salary: "",
    difficulty: "",
    skills: [],
    tools: [],
    resources: [],
    projects: [],
    steps: ["", "", ""],
  });

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

  const [resourceData, setResourceData] = useState({
    title: "",
    category: "",
    type: "",
    thumbnail: "",
    link: "",
    description: "",
  });

  /* ================= AUTH ================= */
  useEffect(() => {
    const role = localStorage.getItem("userType");
    if (!role) navigate("/login");
    else if (role !== "Admin") navigate("/");
  }, [navigate]);

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getUsers");
    const data = await res.json();
    if (data.status === "ok") setUsers(data.data);
  };

  const fetchAlumni = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getAlumni");
    const data = await res.json();
    if (data.status === "ok") setAlumni(data.data);
  };

  const fetchEvents = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getEvents");
    const data = await res.json();
    if (data.status === "ok") setEvents(data.data);
  };

  const fetchRoadmaps = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getRoadmaps");
    const data = await res.json();
    if (data.status === "ok") setRoadmaps(data.data);
  };

  const fetchResources = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getResources");
    const data = await res.json();
    if (data.status === "ok") setResources(data.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchAlumni();
    fetchEvents();
    fetchRoadmaps();
    fetchResources();
  }, []);

  /* ================= DELETE ================= */
  const deleteUser = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteUser/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const deleteAlumni = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteAlumni/${id}`, { method: "DELETE" });
    fetchAlumni();
  };

  const deleteEvent = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteEvent/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const deleteRoadmap = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteRoadmap/${id}`, { method: "DELETE" });
    fetchRoadmaps();
  };

  const deleteResource = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteResource/${id}`, { method: "DELETE" });
    fetchResources();
  };

  /* ================= EVENT STATUS ================= */
  const getEventStatus = (date, time) => {
    const eventDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = eventDateTime - now;

    if (diff > 0) return "Upcoming";
    if (diff <= 0 && diff >= -3600000) return "Live Now";
    return "Completed";
  };

  /* ================= VIEW STUDENTS ================= */
  const viewStudents = async (id) => {
    const res = await fetch(`https://nextstep-project-1.onrender.com/getEventStudents/${id}`);
    const data = await res.json();
    if (data.status === "ok") {
      setStudents(data.data);
      setShowStudents(true);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/login");
  };

  /* ================= FILTER USERS ================= */
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" ? true : u.userType === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveTab("users")}>Users</li>
          <li onClick={() => setActiveTab("alumni")}>Alumni</li>
          <li onClick={() => setActiveTab("events")}>Events</li>
          <li onClick={() => setActiveTab("roadmaps")}>Roadmaps</li>
          <li onClick={() => setActiveTab("resources")}>Resources</li>
          <li onClick={handleLogout} style={{ color: "red" }}>Logout</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main-content">

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Action</th>
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
                      <button onClick={() => deleteUser(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Date</th><th>Time</th><th>Mode</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const status = getEventStatus(e.date, e.time);
                return (
                  <tr key={e._id}>
                    <td>{e.title}</td>
                    <td>{e.date}</td>
                    <td>{e.time}</td>
                    <td>{e.mode}</td>
                    <td>{status}</td>
                    <td>
                      <button onClick={() => viewStudents(e._id)}>Students</button>
                      <button onClick={() => deleteEvent(e._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* ROADMAPS */}
        {activeTab === "roadmaps" && (
          <table className="admin-table">
            <tbody>
              {roadmaps.map((r) => (
                <tr key={r._id}>
                  <td>{r.role}</td>
                  <td>{r.company}</td>
                  <td>{r.category}</td>
                  <td>
                    <button onClick={() => deleteRoadmap(r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* RESOURCES */}
        {activeTab === "resources" && (
          <table className="admin-table">
            <tbody>
              {resources.map((r) => (
                <tr key={r._id}>
                  <td>{r.title}</td>
                  <td>{r.type}</td>
                  <td>
                    <button onClick={() => deleteResource(r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;