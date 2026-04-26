import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

// Protects private routes by checking whether a JWT token exists
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  // If authenticated render the requested page otherwise redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
