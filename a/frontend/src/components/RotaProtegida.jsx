import { Navigate, useLocation } from "react-router-dom";
import { obterUtilizador } from "../utils/authUtils";

function RotaProtegida({ children, perfisPermitidos }) {
  const location = useLocation();
  const utilizador = obterUtilizador();

  if (!utilizador) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    perfisPermitidos &&
    perfisPermitidos.length > 0 &&
    !perfisPermitidos.includes(utilizador.role)
  ) {
    if (utilizador.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (utilizador.role === "vendedor") {
      return <Navigate to="/vendedor/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaProtegida;