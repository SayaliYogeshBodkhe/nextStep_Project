import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  const userType = localStorage.getItem("userType");

  if (!userType) {
    return <Navigate to="/login" />;
  }

  if (userType !== "Admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;