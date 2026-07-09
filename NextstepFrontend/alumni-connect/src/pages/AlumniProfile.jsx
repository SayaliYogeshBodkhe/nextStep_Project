import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./alumniProfile.css";

function AlumniProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const alumni = location.state;

  if (!alumni) {
    return (
      <div className="profile-page">
        <h2>No Profile Found</h2>

        <button className="back-btn" onClick={() => navigate("/alumni")}>
          Back to Alumni
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="profile-card">
        <img
          src={`https://https://nextstep-project-rqyg.onrender.com/uploads/${alumni.photo}`}
          alt={alumni.name}
          className="profile-img"
        />

        <h1>{alumni.name}</h1>
        <h3>{alumni.position}</h3>

        <p>
          <strong>Company:</strong> {alumni.company}
        </p>

        <p>
          <strong>Email:</strong> {alumni.email}
        </p>

        <p>
          <strong>Batch:</strong> {alumni.year}
        </p>

        <div className="tags">
          <span>{alumni.company}</span>
          <span>{alumni.position}</span>
          <span>{alumni.year}</span>
        </div>

        <p className="about">
          Working successfully in IT industry and inspiring juniors.
        </p>

        <button className="connect-btn">Connect</button>
      </div>
    </div>
  );
}

export default AlumniProfile;