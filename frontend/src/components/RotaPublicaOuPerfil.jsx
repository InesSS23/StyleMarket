import { Navigate } from "react-router-dom";
import { obterUtilizador } from "../utils/authUtils";

function RotaPublicaOuPerfil({ children, perfisPermitidos }) {
  const utilizador = obterUtilizador();

  if (!utilizador) {
    return children;
  }

  if (perfisPermitidos.includes(utilizador.role)) {
    return children;
  }

  if (utilizador.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (utilizador.role === "vendedor") {
    return <Navigate to="/vendedor/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

export default RotaPublicaOuPerfil;