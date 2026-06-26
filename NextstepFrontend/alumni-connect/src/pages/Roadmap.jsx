import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./roadmap.css";
import { useNavigate } from "react-router-dom";

function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const itemsPerPage = 6;

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
    } catch (error) {
      console.log("Fetch roadmap error:", error);
    }
  };

  // Filter
  const filtered = roadmaps.filter((r) => {
    const matchSearch =
      (r.role || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.company || "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" || r.category === activeCategory;

    return matchSearch && matchCategory;
  });

  // Pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filtered.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Categories
  const categories = [
    "All",
    ...new Set(roadmaps.map((r) => r.category).filter(Boolean)),
  ];

  return (
    <>
      <Navbar />

      <div className="roadmap-header">
        <h1>Career Roadmaps</h1>
        <p>Step-by-step paths to your dream job</p>
      </div>

      {/* Search */}
      <div className="roadmap-search">
        <input
          type="text"
          placeholder="Search role or company..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="category-bar">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={activeCategory === cat ? "active-chip" : ""}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="roadmap-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div className="roadmap-card" key={item._id}>
              <div className="card-top">
                <img
                  src={item.icon || "https://via.placeholder.com/60"}
                  alt="icon"
                />
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                </div>
              </div>

              <div className="meta">
                <span>{item.location}</span>
                <span>{item.year}</span>
                <span>{item.category}</span>
              </div>

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
          ))
        ) : (
          <h3>No Roadmaps Found</h3>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default Roadmap;