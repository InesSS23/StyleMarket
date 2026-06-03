import { Link, useNavigate } from "react-router-dom";
import { obterUtilizador, terminarSessao } from "../utils/authUtils";

function Navbar() {
  const navigate = useNavigate();
  const utilizador = obterUtilizador();

  function handleLogout() {
    terminarSessao();
    navigate("/");
    window.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          StyleMarket
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Início
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">
                Catálogo
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/carrinho">
                Carrinho
              </Link>
            </li>

            {utilizador && utilizador.role === "vendedor" && (
              <li className="nav-item">
                <Link className="nav-link" to="/vendedor/dashboard">
                  Vendedor
                </Link>
              </li>
            )}

            {utilizador && utilizador.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">
                  Admin
                </Link>
              </li>
            )}

            <li className="nav-item ms-lg-3">
              {utilizador ? (
                <span className="badge bg-light text-dark border px-3 py-2">
                  {utilizador.name} · {utilizador.role}
                </span>
              ) : (
                <span className="badge bg-light text-secondary border px-3 py-2">
                  Sem sessão iniciada
                </span>
              )}
            </li>

            {!utilizador && (
              <>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-dark" to="/login">
                    Entrar
                  </Link>
                </li>

                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-primary" to="/registo">
                    Registar
                  </Link>
                </li>
              </>
            )}

            {utilizador && (
              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;