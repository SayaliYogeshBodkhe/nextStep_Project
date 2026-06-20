import React, { useEffect, useState } from "react";
import "./adminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

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
  });

  const navigate = useNavigate();

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

    if (data.status === "ok") {
      setUsers(data.data);
    }
  };
const fetchRoadmaps = async () => {
  try {
    const res = await fetch(
  "https://nextstep-project-1.onrender.com/getRoadmaps"
);

    const data = await res.json();

    if (data.status === "ok") {
      setRoadmaps(data.data);
    }
  } catch (err) {
    console.log(err);
  }
};
  const fetchAlumni = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getAlumni");
    const data = await res.json();

    if (data.status === "ok") {
      setAlumni(data.data);
    }
  };

  const fetchEvents = async () => {
    const res = await fetch("https://nextstep-project-1.onrender.com/getEvents");
    const data = await res.json();

    if (data.status === "ok") {
      setEvents(data.data);
    }
  };

  useEffect(() => {
     fetchUsers();
    fetchAlumni();
    fetchEvents();
    fetchRoadmaps();
  }, []);

  /* ================= DELETE ================= */
  const deleteUser = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteUser/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  const deleteAlumni = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteAlumni/${id}`, {
      method: "DELETE",
    });

    fetchAlumni();
  };

  const deleteEvent = async (id) => {
    await fetch(`https://nextstep-project-1.onrender.com/deleteEvent/${id}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  /* ================= VIEW STUDENTS ================= */
  const viewStudents = async (id) => {
    const res = await fetch(
      `https://nextstep-project-1.onrender.com/getEventStudents/${id}`
    );

    const data = await res.json();

    if (data.status === "ok") {
      setStudents(data.data);
      setShowStudents(true);
    }
  };

  /* ================= ROADMAP ================= */
  const handleRoadmapChange = (e) => {
  const { name, value } = e.target;

  if (
    name === "skills" ||
    name === "tools" ||
    name === "projects" ||
    name === "resources"
  ) {
    setRoadmapData({
      ...roadmapData,
      [name]: value.split(","),
    });
  } else {
    setRoadmapData({
      ...roadmapData,
      [name]: value,
    });
  }
};

  const addRoadmap = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      "https://nextstep-project-1.onrender.com/addRoadmap",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          role: roadmapData.role,
          category: roadmapData.category,
          icon: roadmapData.icon,
          company: roadmapData.company,
          location: roadmapData.location,
          year: roadmapData.year,

          description: roadmapData.description,
          duration: roadmapData.duration,
          salary: roadmapData.salary,
          difficulty: roadmapData.difficulty,

          skills: roadmapData.skills,
          tools: roadmapData.tools,
          projects: roadmapData.projects,
          resources: roadmapData.resources,

          steps: roadmapData.steps,
        }),
      }
    );

    const data = await res.json();

    if (data.status === "ok") {
      alert("Roadmap Added Successfully");

      setRoadmapData({
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
    } else {
      alert("Failed");
    }
  } catch (error) {
    console.log(error);
  }
};

  /* ================= EDIT ================= */
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
      setEventForm(data);
    }
  };

  /* ================= UPDATE USER ================= */
  const updateUser = async () => {
    await fetch(`https://nextstep-project-1.onrender.com/updateUser/${editId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userForm),
    });

    fetchUsers();
    setShowModal(false);
  };
  /* ================= RESOURCE STATES ================= */

const [resources, setResources] = useState([]);

const [resourceData, setResourceData] = useState({
  title: "",
  category: "",
  type: "",
  thumbnail: "",
  link: "",
  description: "",
});

/* ================= FETCH RESOURCES ================= */

const fetchResources = async () => {
  try {
    const res = await fetch(
      "https://nextstep-project-1.onrender.com/getResources"
    );

    const data = await res.json();

    if (data.status === "ok") {
      setResources(data.data);
    }

  } catch (err) {
    console.log(err);
  }
};

/* ================= USE EFFECT ================= */

useEffect(() => {
  fetchUsers();
  fetchAlumni();
  fetchEvents();
  fetchResources();

}, []);

/* ================= HANDLE RESOURCE CHANGE ================= */

const handleResourceChange = (e) => {

  const { name, value } = e.target;

  setResourceData({
    ...resourceData,
    [name]: value,
  });
};

/* ================= ADD RESOURCE ================= */

const addResource = async (e) => {

  e.preventDefault();

  try {

    const res = await fetch(
      "https://nextstep-project-1.onrender.com/addResource",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(resourceData),
      }
    );

    const data = await res.json();

    if (data.status === "ok") {

      alert("Resource Added");

      fetchResources();

      setResourceData({
        title: "",
        category: "",
        type: "",
        thumbnail: "",
        link: "",
        description: "",
      });

    } else {
      alert("Failed");
    }

  } catch (err) {
    console.log(err);
  }
};

/* ================= DELETE RESOURCE ================= */

const deleteResource = async (id) => {

  try {

    await fetch(
      `https://nextstep-project-1.onrender.com/deleteResource/${id}`,
      {
        method: "DELETE",
      }
    );

    alert("Resource Deleted");

    fetchResources();

  } catch (err) {
    console.log(err);
  }
};
  /* ================= SAVE ALUMNI ================= */
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
      ? `https://nextstep-project-1.onrender.com/updateAlumni/${editId}`
      : "https://nextstep-project-1.onrender.com/addAlumni";

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      body: formData,
    });

    fetchAlumni();
    setShowModal(false);
  };
  /* ================= DELETE ROADMAP ================= */

const deleteRoadmap = async (id) => {
  try {
    await fetch(
      `https://nextstep-project-1.onrender.com/deleteRoadmap/${id}`,
      {
        method: "DELETE",
      }
    );

    alert("Roadmap Deleted");

    fetchRoadmaps(); // refresh roadmap list

  } catch (err) {
    console.log(err);
  }
};

  /* ================= SAVE EVENT ================= */
  const saveEvent = async () => {

  const url = isEdit
    ? `https://nextstep-project-1.onrender.com/updateEvent/${editId}`
  : "https://nextstep-project-1.onrender.com/addEvent";

  try {

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(eventForm),
    });

    const data = await res.json();

    if (data.status === "ok") {

      /* CREATE NOTIFICATION ONLY WHEN NEW EVENT ADDED */

      if (!isEdit) {

        await fetch(
          "https://nextstep-project-1.onrender.com/addNotification",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                "New Event Added 🚀",

              message:
                `${eventForm.title} on ${eventForm.date} at ${eventForm.time}`,

              type: "event",
            }),
          }
        );
      }

      alert(
        isEdit
          ? "Event Updated"
          : "Event Added"
      );

      fetchEvents();

      setShowModal(false);

      setEventForm({
        title: "",
        date: "",
        time: "",
        mode: "",
      });

    } else {

      alert("Failed");
    }

  } catch (err) {

    console.log(err);

    alert("Server Error");
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

    const matchFilter =
      filter === "All"
        ? true
        : u.userType === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h2>Admin Panel</h2>

        <ul>
          <li onClick={() => setActiveTab("users")}>
            Users
          </li>

          <li onClick={() => setActiveTab("alumni")}>
            Alumni
          </li>

          <li onClick={() => setActiveTab("events")}>
            Events
          </li>

          <li onClick={() => setActiveTab("roadmaps")}>
            Roadmaps
          </li>
          <li onClick={() => setActiveTab("resources")}>
            Resources
          </li>

          <li
            onClick={handleLogout}
            style={{ color: "red" }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        
        {/* USERS */}
        {activeTab === "users" && (
          <>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
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
                      <button
                        onClick={() =>
                          handleEdit(u, "user")
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(u._id)
                        }
                      >
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
                        src={`https://nextstep-project-1.onrender.com/uploads/${a.photo}`}
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
                      <button
                        onClick={() =>
                          handleEdit(a, "alumni")
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteAlumni(a._id)
                        }
                      >
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
                      <button
                        onClick={() =>
                          handleEdit(e, "event")
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteEvent(e._id)
                        }
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          viewStudents(e._id)
                        }
                      >
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
          <div className="admin-roadmap">

            <h2>Add Roadmap</h2>

            <form onSubmit={addRoadmap}>

              <input
                type="text"
                name="role"
                placeholder="Role"
                value={roadmapData.role}
                onChange={handleRoadmapChange}
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={roadmapData.category}
                onChange={handleRoadmapChange}
              />

              <input
                type="text"
                name="icon"
                placeholder="Icon URL"
                value={roadmapData.icon}
                onChange={handleRoadmapChange}
              />

              <input
                type="text"
                name="company"
                placeholder="Company"
                value={roadmapData.company}
                onChange={handleRoadmapChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={roadmapData.location}
                onChange={handleRoadmapChange}
              />

              <input
                type="text"
                name="year"
                placeholder="Year"
                value={roadmapData.year}
                onChange={handleRoadmapChange}
              />

             <input
                type="text"
                placeholder="Step 1"
                value={roadmapData.steps[0]}
                onChange={(e) => {
                  const newSteps = [...roadmapData.steps];
                  newSteps[0] = e.target.value;

                  setRoadmapData({
                    ...roadmapData,
                    steps: newSteps,
                  });
                }}
              />

              

              <input
                type="text"
                placeholder="Step 2"
                value={roadmapData.steps[1]}
                onChange={(e) => {
                  const newSteps = [...roadmapData.steps];
                  newSteps[1] = e.target.value;

                  setRoadmapData({
                    ...roadmapData,
                    steps: newSteps,
                  });
                }}
              />
              <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={roadmapData.description}
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration"
                    value={roadmapData.duration}
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="salary"
                    placeholder="Salary"
                    value={roadmapData.salary}
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="difficulty"
                    placeholder="Difficulty"
                    value={roadmapData.difficulty}
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="skills"
                    placeholder="Skills (comma separated)"
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="tools"
                    placeholder="Tools (comma separated)"
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="projects"
                    placeholder="Projects (comma separated)"
                    onChange={handleRoadmapChange}
                  />

                  <input
                    type="text"
                    name="resources"
                    placeholder="Resources (comma separated)"
                    onChange={handleRoadmapChange}
                  />

              <button type="submit">
                Add Roadmap
              </button>


            </form>
          </div>
        )}
        
      </div>
      


  {activeTab === "roadmaps" && (
  <div className="admin-roadmap">

    

    <form onSubmit={addRoadmap}>

      {/* ALL INPUTS */}

    </form>

    {/* ADD TABLE HERE */}

    <h2 className="roadmap-list-title">
      All Roadmaps
    </h2>

    <table className="admin-table roadmap-table">

      <thead>
        <tr>
          <th>Icon</th>
          <th>Role</th>
          <th>Company</th>
          <th>Category</th>
          <th>Location</th>
          <th>Year</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>

        {roadmaps.map((r) => (
          <tr key={r._id}>

            <td>
              <img
                src={r.icon}
                alt=""
                className="roadmap-table-img"
              />
            </td>

            <td>{r.role}</td>
            <td>{r.company}</td>
            <td>{r.category}</td>
            <td>{r.location}</td>
            <td>{r.year}</td>

            <td>
              <button
                className="delete-roadmap-btn"
                onClick={() =>
                  deleteRoadmap(r._id)
                }
              >
                Delete
              </button>
            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>
)}
    {/* ================= RESOURCES ADMIN SECTION ================= */}

{/* ================= RESOURCES ================= */}

{activeTab === "resources" && (
  <div className="resources-admin-container">

    {/* ================= FORM ================= */}

    <div className="resource-form-card">

      <h2>Add New Resource</h2>

      <form onSubmit={addResource}>

        <div className="resource-grid">

          <input
            type="text"
            placeholder="Resource Title"
            value={resourceData.title}
            onChange={(e) =>
              setResourceData({
                ...resourceData,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={resourceData.category}
            onChange={(e) =>
              setResourceData({
                ...resourceData,
                category: e.target.value,
              })
            }
          />

          <select
            value={resourceData.type}
            onChange={(e) =>
              setResourceData({
                ...resourceData,
                type: e.target.value,
              })
            }
          >
            <option value="">
              Select Type
            </option>

            <option value="PDF">
              PDF
            </option>

            <option value="Video">
              Video
            </option>

            <option value="Website">
              Website
            </option>
          </select>

          <input
            type="text"
            placeholder="Thumbnail URL"
            value={resourceData.thumbnail}
            onChange={(e) =>
              setResourceData({
                ...resourceData,
                thumbnail: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Resource Link"
            value={resourceData.link}
            onChange={(e) =>
              setResourceData({
                ...resourceData,
                link: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            value={resourceData.description}
            onChange={(e) =>
              setResourceData({
                ...resourceData,
                description: e.target.value,
              })
            }
          ></textarea>

        </div>

        <button
          type="submit"
          className="resource-submit-btn"
        >
          Add Resource
        </button>

      </form>
    </div>

    {/* ================= TABLE ================= */}

    <div className="resource-table-card">

      <h2>All Resources</h2>

      <table className="resource-table">

        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Type</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {resources.map((r) => (
            <tr key={r._id}>

              <td>
                <img
                  src={r.thumbnail}
                  alt=""
                  className="resource-thumb"
                />
              </td>

              <td>{r.title}</td>

              <td>{r.category}</td>

              <td>{r.type}</td>

              <td>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="resource-link"
                >
                  Open
                </a>
              </td>

              <td>
                <button
                  className="delete-resource-btn"
                  onClick={() =>
                    deleteResource(r._id)
                  }
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  </div>
)}


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

            <button
              onClick={() =>
                setShowStudents(false)
              }
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal">

            {/* USER */}
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

                <button onClick={updateUser}>
                  Save
                </button>
              </>
            )}

            {/* ALUMNI */}
            {activeTab === "alumni" && (
              <form onSubmit={saveAlumni}>

                <h2>
                  {isEdit
                    ? "Edit Alumni"
                    : "Add Alumni"}
                </h2>

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

                <button type="submit">
                  Save
                </button>

              </form>
            )}

            {/* EVENTS */}
            {activeTab === "events" && (
              <>
                <h2>
                  {isEdit
                    ? "Edit Event"
                    : "Add Event"}
                </h2>

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
                  <option value="">
                    Select Mode
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Offline">
                    Offline
                  </option>
                </select>

                <button onClick={saveEvent}>
                  Save
                </button>
              </>
            )}

            <button
              onClick={() =>
                setShowModal(false)
              }
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;