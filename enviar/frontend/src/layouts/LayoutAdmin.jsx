import { Link, Outlet } from "react-router-dom";

function LayoutAdmin() {
  return (
    <div className="d-flex layout-dashboard">
      <aside className="sidebar-dashboard bg-dark text-white p-4">
        <h4 className="mb-4">Admin</h4>

        <nav className="nav flex-column gap-2">
          <Link className="nav-link text-white" to="/admin/dashboard">
            Dashboard
          </Link>

          <Link className="nav-link text-white" to="/admin/utilizadores">
            Utilizadores
          </Link>

          <Link className="nav-link text-white" to="/admin/produtos">
            Produtos
          </Link>

          <Link className="nav-link text-white" to="/admin/categorias">
            Categorias
          </Link>

          <Link className="nav-link text-white" to="/admin/encomendas">
            Encomendas
          </Link>

          <Link className="nav-link text-white" to="/">
            Voltar à Loja
          </Link>
        </nav>
      </aside>

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;