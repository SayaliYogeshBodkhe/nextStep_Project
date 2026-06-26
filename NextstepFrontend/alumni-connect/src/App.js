import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

/* Pages */
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
import RoadmapDetails from "./pages/RoadmapDetail";

/* Protected Routes */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {

  useEffect(() => {

    const getCurrentUser = async () => {
      try {
        const res = await fetch(
          "https://nextstep-project-1.onrender.com/current-user",
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.log("Current user API failed");
          return;
        }

        const data = await res.json();
        console.log("CURRENT USER:", data);

        // 🔥 SAFE ROLE EXTRACTION (important fix)
        const role = data?.user?.userType || data?.user?.role;

        if (role) {
          localStorage.setItem("userType", role);
        }

      } catch (err) {
        console.log("Error fetching current user:", err);
      }
    };

    getCurrentUser();

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