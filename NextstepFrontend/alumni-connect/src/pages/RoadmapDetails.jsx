import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./roadmapDetails.css";

function RoadmapDetail() {
  const { id } = useParams();

  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    const res = await fetch(
      `https://nextstep-project-1.onrender.com/getRoadmap/${id}`
    );

    const data = await res.json();

    if (data.status === "ok") {
      setRoadmap(data.data);
    }
  };

  if (!roadmap) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="detail-hero">

        <div className="hero-left">
          <img src={roadmap.icon} alt="" />
        </div>

        <div className="hero-right">

          <h1>{roadmap.role}</h1>

          <p>{roadmap.description}</p>

          <div className="hero-tags">
            <span>{roadmap.company}</span>
            <span>{roadmap.location}</span>
            <span>{roadmap.year}</span>
          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>⏳ Duration</h3>
          <p>{roadmap.duration}</p>
        </div>

        <div className="stat-card">
          <h3>💰 Salary</h3>
          <p>{roadmap.salary}</p>
        </div>

        <div className="stat-card">
          <h3>🔥 Difficulty</h3>
          <p>{roadmap.difficulty}</p>
        </div>

      </div>

      {/* SKILLS */}
      <div className="section">
        <h2>Skills Required</h2>

        <div className="chips">
          {roadmap.skills?.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>

      {/* TOOLS */}
      <div className="section">
        <h2>Tools & Tech</h2>

        <div className="chips">
          {roadmap.tools?.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <div className="section">
        <h2>Projects To Build</h2>

        <div className="project-grid">
          {roadmap.projects?.map((p, i) => (
            <div className="project-card" key={i}>
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* ROADMAP STEPS */}
      <div className="section">
        <h2>Learning Roadmap</h2>

        <div className="timeline">
          {roadmap.steps?.map((step, i) => (
            <div className="timeline-card" key={i}>

              <div className="step-number">
                {i + 1}
              </div>

              <div>
                <h3>Step {i + 1}</h3>
                <p>{step}</p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RESOURCES */}
      <div className="section">
        <h2>Resources</h2>

        <ul className="resource-list">
          {roadmap.resources?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default RoadmapDetail;