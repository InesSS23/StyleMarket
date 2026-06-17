import { Link } from "react-router-dom";

import { obterUtilizador } from "../utils/authUtils";

function Navbar() {
  const utilizador = obterUtilizador();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
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

        <div
          className="collapse navbar-collapse"
          id="menuPrincipal"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
              >
                Início
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/catalogo"
              >
                Catálogo
              </Link>
            </li>

            {(!utilizador ||
              utilizador.role === "comprador") && (
                <li className="nav-item ms-lg-2">
                  <Link
                    className="nav-link"
                    to="/carrinho"
                  >
                    Carrinho
                  </Link>
                </li>
              )}

            {utilizador?.role === "comprador" && (
              <li className="nav-item ms-lg-2">
                <Link
                  className="nav-link navbar-icon-link d-flex align-items-center justify-content-center p-1"
                  to="/perfil"
                  aria-label="Abrir perfil"
                  title="Perfil"
                >
                  <img
                    src="/images/perfil.png"
                    alt="Perfil"
                    className="navbar-menu-icon"
                  />
                </Link>
              </li>
            )}

            {utilizador?.role === "vendedor" && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/vendedor/dashboard"
                >
                  Painel Vendedor
                </Link>
              </li>
            )}

            {utilizador?.role === "admin" && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/admin/dashboard"
                >
                  Painel Admin
                </Link>
              </li>
            )}

            {!utilizador && (
              <>
                <li className="nav-item ms-lg-3">
                  <Link
                    className="btn btn-outline-dark"
                    to="/login"
                  >
                    Entrar
                  </Link>
                </li>

                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-primary"
                    to="/registo"
                  >
                    Registar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;