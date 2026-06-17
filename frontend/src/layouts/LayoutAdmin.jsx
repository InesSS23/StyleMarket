import "../styles/admin.css";

import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { terminarSessao } from "../utils/authUtils";
import { limparCarrinhoVisitante } from "../utils/carrinhoUtils";

function LayoutAdmin() {
  const navigate = useNavigate();

  function handleLogout() {
    limparCarrinhoVisitante();
    terminarSessao();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo">
            <h5>StyleMarket</h5>
            <small>Painel Admin</small>
          </div>

          <nav className="admin-nav">
            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <Link to="/admin/utilizadores">
              Utilizadores
            </Link>

            <Link to="/admin/produtos">
              Produtos
            </Link>

            <Link to="/admin/categorias">
              Categorias
            </Link>

            <Link to="/admin/encomendas">
              Encomendas
            </Link>
          </nav>
        </div>

        <div className="d-grid gap-2">
          <Link
            className="btn btn-outline-secondary"
            to="/"
          >
            Voltar à Loja
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            Terminar sessão
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;