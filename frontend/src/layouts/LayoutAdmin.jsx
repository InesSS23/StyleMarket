import "../styles/admin.css";
import { Link, Outlet } from "react-router-dom";

function LayoutAdmin() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo">
            <h5>StyleMarket</h5>
            <small>Painel Admin</small>
          </div>

          <nav className="admin-nav">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/utilizadores">Utilizadores</Link>
            <Link to="/admin/produtos">Produtos</Link>
            <Link to="/admin/categorias">Categorias</Link>
            <Link to="/admin/encomendas">Encomendas</Link>
          </nav>
        </div>

        <Link className="admin-back-link" to="/">
        Voltar à Loja
        </Link>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;