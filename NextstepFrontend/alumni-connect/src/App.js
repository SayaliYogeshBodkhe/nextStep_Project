import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Roadmap from "./pages/Roadmap";
import Resources from "./pages/Resources";
import Alumni from "./pages/Alumni";
import AlumniProfile from "./pages/AlumniProfile";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import SingleProfile from "./pages/SingleProfile";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Admin Protected Route
const AdminRoute = ({ children }) => {
  const userType = localStorage.getItem("userType");

  if (!userType) return <Navigate to="/login" />;
  if (userType !== "Admin") return <Navigate to="/" />;

  return children;
};

function App() {
  useEffect(() => {
    fetch("http://localhost:5000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        if (user) {
          const role = user.userType || "User";
          localStorage.setItem("userType", role);

          if (role === "Admin") {
            window.location.href = "/admin-dashboard";
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/alumni-profile" element={<AlumniProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/single-profile" element={<SingleProfile />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;