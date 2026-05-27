import { Link, Outlet } from "react-router-dom";

function LayoutVendedor() {
  return (
    <div className="d-flex layout-dashboard">
      <aside className="sidebar-dashboard bg-dark text-white p-4">
        <h4 className="mb-4">Vendedor</h4>

        <nav className="nav flex-column gap-2">
          <Link className="nav-link text-white" to="/vendedor/dashboard">
            Dashboard
          </Link>

          <Link className="nav-link text-white" to="/vendedor/produtos">
            Os Meus Produtos
          </Link>

          <Link className="nav-link text-white" to="/vendedor/adicionar-produto">
            Adicionar Produto
          </Link>

          <Link className="nav-link text-white" to="/vendedor/vendas">
            Vendas
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

export default LayoutVendedor;