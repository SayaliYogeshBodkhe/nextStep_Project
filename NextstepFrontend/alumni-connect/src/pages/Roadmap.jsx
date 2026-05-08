import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./roadmap.css";
import { useNavigate } from "react-router-dom";

function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  /* ================= FETCH ROADMAPS ================= */
  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch("http://localhost:5000/getRoadmaps");
      const data = await res.json();

      if (data.status === "ok") {
        setRoadmaps(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FILTER ================= */
  const filtered = roadmaps.filter((r) => {
    const matchSearch =
      (r.role || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.company || "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" || r.category === activeCategory;

    return matchSearch && matchCategory;
  });

  /* ================= UNIQUE CATEGORIES ================= */
  const categories = [
    "All",
    ...new Set(roadmaps.map((r) => r.category).filter(Boolean)),
  ];

  return (
    <>
      <Navbar />

      {/* HEADER */}
      <div className="roadmap-header">
        <h1>Career Roadmaps</h1>
        <p>Step-by-step paths to your dream job</p>
      </div>

      {/* SEARCH */}
      <div className="roadmap-search">
        <input
          type="text"
          placeholder="Search role or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY FILTER */}
      <div className="category-bar">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={activeCategory === cat ? "active-chip" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ROADMAP GRID */}
      <div className="roadmap-grid">
        {filtered.map((item) => (
          <div className="roadmap-card" key={item._id}>

            {/* HEADER */}
            <div className="card-top">
              <img src={item.icon} alt="icon" />
              <div>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
            </div>

            {/* META */}
            <div className="meta">
              <span>{item.location}</span>
              <span>{item.year}</span>
              <span>{item.category}</span>
            </div>

            {/* STEPS PREVIEW */}
            <div className="steps">
              {item.steps?.slice(0, 3).map((step, index) => (
                <div className="step" key={index}>
                  <div className="circle">{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <button
              className="learn-btn"
              onClick={() => navigate(`/roadmap/${item._id}`)}
            >
              View Full Roadmap
            </button>

          </div>
        ))}
      </div>
    </>
  );
}

export default Roadmap;