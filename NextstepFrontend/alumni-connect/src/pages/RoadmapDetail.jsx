import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./roadmapDetails.css"; // ✅ IMPORTANT: connect CSS

function RoadmapDetails() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`http://localhost:5000/getRoadmap/${id}`);
        const data = await res.json();

        if (data.status === "ok") {
          setRoadmap(data.data);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchRoadmap();
  }, [id]);

  if (!roadmap) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <>
      <Navbar />

      <div className="roadmap-details">

        {/* HERO SECTION */}
        <div className="detail-hero">
          <div className="hero-left">
            <img src="/roadmap.png" alt="logo" />
          </div>

          <div className="hero-right">
            <h1>{roadmap.role}</h1>
            <p>{roadmap.company}</p>

            <div className="hero-tags">
              <span>{roadmap.location}</span>
              <span>{roadmap.year}</span>
              <span>{roadmap.category}</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Role</h3>
            <p>{roadmap.role}</p>
          </div>

          <div className="stat-card">
            <h3>Company</h3>
            <p>{roadmap.company}</p>
          </div>

          <div className="stat-card">
            <h3>Category</h3>
            <p>{roadmap.category}</p>
          </div>
        </div>

        {/* STEPS */}
        <div className="section">
          <h2>Roadmap Steps</h2>

          <div className="timeline">
            {roadmap.steps?.map((step, index) => (
              <div className="timeline-card" key={index}>
                <div className="step-number">{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default RoadmapDetails;