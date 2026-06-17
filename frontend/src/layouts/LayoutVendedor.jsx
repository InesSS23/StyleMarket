import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { terminarSessao } from "../utils/authUtils";
import { limparCarrinhoVisitante } from "../utils/carrinhoUtils";

function LayoutVendedor() {
  const navigate = useNavigate();

  function handleLogout() {
    limparCarrinhoVisitante();
    terminarSessao();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="d-flex layout-dashboard">
      <aside className="sidebar-dashboard bg-dark text-white p-4 d-flex flex-column">
        <h4 className="mb-4">
          Vendedor
        </h4>

        <nav className="nav flex-column gap-2">
          <Link
            className="nav-link text-white"
            to="/vendedor/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="nav-link text-white"
            to="/vendedor/produtos"
          >
            Os Meus Produtos
          </Link>

          <Link
            className="nav-link text-white"
            to="/vendedor/adicionar-produto"
          >
            Adicionar Produto
          </Link>

          <Link
            className="nav-link text-white"
            to="/vendedor/vendas"
          >
            Vendas
          </Link>

          <Link
            className="nav-link text-white"
            to="/vendedor/perfil"
          >
            Perfil da Loja
          </Link>
        </nav>

        <div className="mt-auto pt-4 d-grid gap-2">
          <Link
            className="btn btn-outline-light"
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

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutVendedor;