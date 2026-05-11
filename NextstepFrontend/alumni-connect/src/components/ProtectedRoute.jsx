import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const user = localStorage.getItem("userType");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;