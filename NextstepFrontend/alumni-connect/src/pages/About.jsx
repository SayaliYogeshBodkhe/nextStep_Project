import Navbar from "../components/Navbar";
import "./about.css";

function About() {
  return (
    <>
      <Navbar />

      {/* About Section */}
      <div className="about">
        <h1>About Us</h1>
        <p>
          NextStep is a platform designed to help students prepare for placements
          with the support of alumni and TPO guidance. We aim to bridge the gap
          between students and industry professionals.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mission">
        <h2>Our Mission</h2>
        <p>
          To empower students with the right skills, guidance, and opportunities
          to succeed in their careers.
        </p>
      </div>

      {/* Team Section */}
      <div className="team">
        <h2>Our Team</h2>

        <div className="team-cards">
          <div className="member">
            <h3>Your Name</h3>
            <p>Frontend Developer</p>
          </div>

          <div className="member">
            <h3>Member 2</h3>
            <p>Backend Developer</p>
          </div>

          <div className="member">
            <h3>Member 3</h3>
            <p>UI Designer</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>NextStep</p>
        <p>Home | Events | Dashboard | Contact</p>
        <p>© 2026 NextStep</p>
      </div>
    </>
  );
}

export default About;