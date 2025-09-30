import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  const loc = useLocation();
  
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  
  return children;
}
