import { Link } from "react-router-dom";

function Navbar() {
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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

            <li className="nav-item">
              <Link className="nav-link" to="/vendedor/dashboard">
                Vendedor
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                Admin
              </Link>
            </li>

            <li className="nav-item ms-lg-3">
              <Link className="btn btn-outline-dark" to="/login">
                Entrar
              </Link>
            </li>

            <li className="nav-item ms-lg-2">
              <Link className="btn btn-primary" to="/registo">
                Registar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;