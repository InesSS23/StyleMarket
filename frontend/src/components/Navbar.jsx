import { Link, useNavigate } from "react-router-dom";
import {
  obterUtilizador,
  terminarSessao,
} from "../utils/authUtils";
import {
  limparCarrinhoVisitante,
} from "../utils/carrinhoUtils";

function Navbar() {
  const navigate = useNavigate();
  const utilizador = obterUtilizador();

  function obterNomeApresentado() {
    if (!utilizador) {
      return "";
    }

    if (utilizador.role === "vendedor") {
      return utilizador.storeName || utilizador.name;
    }

    return utilizador.name;
  }

  function handleLogout() {
    /*
      O carrinho da conta do comprador permanece guardado.
      O carrinho do visitante fica sempre vazio após logout.
    */
    limparCarrinhoVisitante();
    terminarSessao();

    navigate("/", { replace: true });
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

        <div
          className="collapse navbar-collapse"
          id="menuPrincipal"
        >
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

            {(!utilizador ||
              utilizador.role === "comprador") && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/carrinho"
                >
                  Carrinho
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

            {utilizador && (
              <li className="nav-item ms-lg-3">
                <span className="badge bg-light text-dark border px-3 py-2">
                  {obterNomeApresentado()}
                </span>
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

            {utilizador && (
              <li className="nav-item ms-lg-2">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
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
