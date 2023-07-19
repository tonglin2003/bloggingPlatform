import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);
  console.log("currentUser in ProtectedRoute:", currentUser);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}