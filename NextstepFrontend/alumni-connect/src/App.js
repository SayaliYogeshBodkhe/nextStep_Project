import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import RoadmapDetails from "./pages/RoadmapDetails";

/* PROTECTED ROUTES */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {

  useEffect(() => {

    fetch("http://localhost:5000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {

        if (user && user.userType) {

          localStorage.setItem(
            "userType",
            user.userType
          );

        }

      })
      .catch((err) => console.log(err));

  }, []);

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* ================= PROTECTED USER ROUTES ================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap/:id"
          element={
            <ProtectedRoute>
              <RoadmapDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumni"
          element={
            <ProtectedRoute>
              <Alumni />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumni-profile"
          element={
            <ProtectedRoute>
              <AlumniProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/single-profile"
          element={
            <ProtectedRoute>
              <SingleProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTE ================= */}

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