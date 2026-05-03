import Navbar from "../components/Navbar";
import "./roadmap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAngleDown } from "@fortawesome/free-solid-svg-icons";

function Roadmap() {
  return (
    <>
      <Navbar />

      {/* HEADER */}
      <div className="header">
        <h2>Placed Juniors</h2>
      </div>

      {/* TITLE */}
      <div className="title">
        <h1>Career Roadmaps</h1>
        <p>Explore step-by-step guides to land your dream job</p>
      </div>

      {/* FILTER BAR */}
      <div className="filters">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" placeholder="Search by role or company" />
        </div>

        <select><option>Year</option></select>
        <select><option>Company</option></select>
        <select><option>Location</option></select>

        <button className="filter-btn">
          Filter <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className="active">By Role</button>
        <button>By Company</button>

        <button className="view-all">View All →</button>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="chips">
        <span className="chip active">💻 Software Engineering</span>
        <span className="chip">📊 Data Science</span>
        <span className="chip">🎨 UI/UX Design</span>
        <span className="chip">☁️ Cloud Engineering</span>
      </div>

      {/* ROADMAP CARDS */}
      <div className="container">

        {/* CARD 1 */}
        <div className="card">
          <div className="card-header">
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="icon" />
            <h3>Software Engineer</h3>
          </div>

          <div className="steps">
            <div className="step">
              <div className="circle">1</div>
              <p>Learn DSA</p>
            </div>

            <div className="step">
              <div className="circle">2</div>
              <p>Backend Development</p>
            </div>

            <div className="step">
              <div className="circle">3</div>
              <p>Practice Coding</p>
            </div>
          </div>

          <button className="primary">Learn More</button>
        </div>

        {/* CARD 2 */}
        <div className="card">
          <div className="card-header">
            <img src="https://cdn-icons-png.flaticon.com/512/888/888859.png" alt="icon" />
            <h3>Data Scientist</h3>
          </div>

          <div className="steps">
            <div className="step">
              <div className="circle">1</div>
              <p>Python & SQL</p>
            </div>

            <div className="step">
              <div className="circle">2</div>
              <p>Machine Learning</p>
            </div>

            <div className="step">
              <div className="circle">3</div>
              <p>Build Projects</p>
            </div>
          </div>

          <button className="primary">Learn More</button>
        </div>

        {/* CARD 3 */}
        <div className="card">
          <div className="card-header">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" alt="icon" />
            <h3>UI/UX Designer</h3>
          </div>

          <div className="steps">
            <div className="step">
              <div className="circle">1</div>
              <p>Design Basics</p>
            </div>

            <div className="step">
              <div className="circle">2</div>
              <p>Figma</p>
            </div>

            <div className="step">
              <div className="circle">3</div>
              <p>Portfolio</p>
            </div>
          </div>

          <button className="primary">Learn More</button>
        </div>

      </div>
    </>
  );
}

export default Roadmap;