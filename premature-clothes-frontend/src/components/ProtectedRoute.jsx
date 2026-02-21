import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(ProductContext);

  // Redirección programática: si no hay usuario, mandarlo al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;