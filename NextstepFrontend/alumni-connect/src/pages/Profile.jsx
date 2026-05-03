import Navbar from "../components/Navbar";
import "./profile.css";

function Profile() {
  return (
    <>
      <Navbar />

      {/* Main Layout */}
      <div className="container">

        {/* Left Section */}
        <div className="left">
          <h2>Name</h2>
          <p>
            (other profile information which was filled at the time of login)
          </p>
        </div>

        {/* Right Section */}
        <div className="right">
          <div className="profile-box">
            Profile img
          </div>
        </div>

      </div>
    </>
  );
}

export default Profile;