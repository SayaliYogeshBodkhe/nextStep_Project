import Navbar from "../components/Navbar";
import "./resources.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors, faVideo, faCalendar } from "@fortawesome/free-solid-svg-icons";

function Resources() {
  return (
    <>
      <Navbar />

      <div className="hero">
        <h1>Resources</h1>
        <p>
          Your hub for experience research. Tools & insights to elevate your research game.
        </p>

        {/* Categories */}
        <div className="categories">

          <div className="cat">
            <div className="icon guides">
              <FontAwesomeIcon icon={faScissors} />
            </div>
            Guides
          </div>

          <div className="cat">
            <div className="icon videos">
              <FontAwesomeIcon icon={faVideo} />
            </div>
            Videos
          </div>

          <div className="cat">
            <div className="icon events">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            PDFs
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

export default Resources;