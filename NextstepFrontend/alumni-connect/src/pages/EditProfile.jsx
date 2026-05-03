import Navbar from "../components/Navbar";
import "./editprofile.css";

function EditProfile() {
  return (
    <>
      <Navbar />

      <div className="container">

        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="menu">
            <li className="active">Edit Profile</li>
            <li>Notification</li>
            <li>Security</li>
            <li>Appearance</li>
            <li>Help</li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="align">
          <main className="main">
            <h2>Edit Profile</h2>

            <form className="profile-form">

              <div className="row">
                <div className="field">
                  <label>First Name</label>
                  <input type="text" defaultValue="Mehrab" />
                </div>

                <div className="field">
                  <label>Last Name</label>
                  <input type="text" defaultValue="Bozorgi" />
                </div>
              </div>

              <div className="field full">
                <label>Email</label>
                <input type="email" defaultValue="mehrabbozorgi.business@gmail.com" />
              </div>

              <div className="field full">
                <label>Address</label>
                <input type="text" defaultValue="33062 Zboncak isle" />
              </div>

              <div className="field full">
                <label>Contact Number</label>
                <input type="text" defaultValue="58077.79" />
              </div>

              <div className="row">
                <div className="field">
                  <label>City</label>
                  <select>
                    <option>Pune</option>
                  </select>
                </div>

                <div className="field">
                  <label>State</label>
                  <select>
                    <option>Maharashtra</option>
                  </select>
                </div>
              </div>

              <div className="field full">
                <label>Password</label>
                <input type="password" defaultValue="password123" />
              </div>

              <div className="buttons">
                <button type="button" className="cancel">Cancel</button>
                <button type="submit" className="save">Save</button>
              </div>

            </form>
          </main>
        </div>

      </div>
    </>
  );
}

export default EditProfile;