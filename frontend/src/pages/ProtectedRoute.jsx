import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuth = token && token !== "null" && token !== "undefined";

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
