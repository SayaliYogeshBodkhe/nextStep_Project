import Navbar from "../components/Navbar";
import "./singleprofile.css";
import { useParams } from "react-router-dom";

// ✅ IMPORT IMAGE (IMPORTANT)
import sayali from "../assets/sayali.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleCheck,
  faLocationDot,
  faCalendar,
  faUser,
  faBriefcase,
  faGraduationCap,
  faCode,
  faTrophy,
  faLink,
  faUserPlus,
  faDownload,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

function SingleProfile() {
  const {} = useParams();

  // 🔥 Dummy Data (later replace with API)
  const user = {
    name: "Sayli Bhodke",
    role: "Software Development Engineer @ Google",
    location: "Pune, India",
    year: "2026",
    cgpa: "9.2",
    package: "₹32 LPA",
    rank: "AIR 248",
    image: sayali   // ✅ attach image here
  };

  return (
    <>
      <Navbar />

      {/* BACK */}
      <div className="back">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Placed Juniors
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">

        {/* LEFT IMAGE */}
        <div className="left">
          <img
            src={user.image}   // ✅ FIXED IMAGE
            className="profile-img"
            alt="profile"
          />
        </div>

        {/* CENTER */}
        <div className="center">
          <h1>
            {user.name} <FontAwesomeIcon icon={faCircleCheck} />
          </h1>

          <p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              className="google-logo"
              alt="company"
            />
            {user.role}
          </p>

          <span>
            <FontAwesomeIcon icon={faLocationDot} /> {user.location}
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faCalendar} /> Placed {user.year}
          </span>

          <div className="tags">
            <span className="green">Placed {user.year}</span>
            <span className="yellow">Top Company</span>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="right">
          <button className="primary">
            <FontAwesomeIcon icon={faUserPlus} /> Connect
          </button>

          <button className="secondary">
            <FontAwesomeIcon icon={faDownload} /> Download CV
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-box">
          <h2>{user.cgpa} ⭐</h2>
          <p>CGPA</p>
        </div>

        <div className="stat-box">
          <h2>{user.package}</h2>
          <p>Package</p>
        </div>

        <div className="stat-box">
          <h2>{user.rank}</h2>
          <p>GATE Rank</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* LEFT */}
        <div className="left-content">

          <div className="card">
            <h3><FontAwesomeIcon icon={faUser} /> About</h3>
            <p>
              Passionate software engineer skilled in full-stack development,
              DSA and cloud technologies.
            </p>
          </div>

          <div className="card">
            <h3><FontAwesomeIcon icon={faBriefcase} /> Placement Details</h3>
            <p><b>Company:</b> Google</p>
            <p><b>Role:</b> SDE</p>
            <p><b>Location:</b> Bangalore</p>
          </div>

          <div className="card">
            <h3><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
            <p>B.Tech - PCCOE (2022-2026)</p>
            <p>CGPA: {user.cgpa}</p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="right-content">

          <div className="card">
            <h3><FontAwesomeIcon icon={faCode} /> Skills</h3>
            <div className="skills">
              <span>Java</span>
              <span>Python</span>
              <span>React</span>
              <span>Node.js</span>
              <span>DSA</span>
            </div>
          </div>

          <div className="card">
            <h3><FontAwesomeIcon icon={faTrophy} /> Achievements</h3>
            <ul>
              <li>500+ DSA problems solved</li>
              <li>Google Kickstart Qualified</li>
              <li>Topper in 3rd Year</li>
            </ul>
          </div>

          <div className="card">
            <h3><FontAwesomeIcon icon={faLink} /> Connect</h3>

            <button className="primary full">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </button>

            <button className="secondary full">
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </button>

            <button className="secondary full">
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

export default SingleProfile;