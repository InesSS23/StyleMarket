import { useEffect, useState } from "react";
import api from "../../services/api";

function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalVendedores: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
  });
  const [encomendasRecentes, setEncomendasRecentes] = useState([]);
  const [utilizadoresRecentes, setUtilizadoresRecentes] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dashboardResponse = await api.get("/dashboard/stats");
        if (dashboardResponse.data.success) {
          setStats(dashboardResponse.data.data);
        }

        const usersResponse = await api.get("/utilizadores/listar");
        if (usersResponse.data.success) {
          const users = usersResponse.data.data;
          setUtilizadoresRecentes(
            users
              .slice(-5)
              .reverse()
              .map((user) => ({
                nome: user.name,
                email: user.email,
                perfil: user.role,
                estado: "Ativo",
              }))
          );
        }

        const ordersResponse = await api.get("/encomendas/listar");
        if (ordersResponse.data.success) {
          const orders = ordersResponse.data.data;
          setEncomendasRecentes(
            orders
              .slice(0, 5)
              .map((order, index) => ({
                numero: `#${order.id}`,
                comprador: order.buyer?.name || order.customerName || "N/A",
                total: `${Number(order.total).toFixed(2)}€`,
                estado: order.status,
              }))
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }

    carregarDados();
  }, []);

  function badgeClass(estado) {
    if (estado === "Concluída" || estado === "Ativo") return "admin-badge admin-badge--green";
    if (estado === "Enviada" || estado === "Vendedor") return "admin-badge admin-badge--blue";
    if (estado === "Paga") return "admin-badge admin-badge--purple";
    if (estado === "Pendente") return "admin-badge admin-badge--yellow";
    return "admin-badge admin-badge--gray";
  }

  const maxMonthlyRevenue = Math.max(...stats.monthlyRevenue.map((item) => item.revenue), 1);
  const chartWidth = 1000;
  const pointStep =
    stats.monthlyRevenue.length > 1
      ? chartWidth / (stats.monthlyRevenue.length - 1)
      : chartWidth;
  const chartPoints = stats.monthlyRevenue
    .map(
      (item, index) =>
        `${index * pointStep},${200 - (item.revenue / maxMonthlyRevenue) * 150}`
    )
    .join(" ");

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard do Administrador</h1>
        <p>Visão geral da plataforma StyleMarket.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div>
            <span>Total de Utilizadores</span>
            <strong>{stats.totalUsers.toLocaleString()}</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--blue">👥</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total de Produtos</span>
            <strong>{stats.totalProducts.toLocaleString()}</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--purple">📦</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total de Vendedores</span>
            <strong>{stats.totalVendedores.toLocaleString()}</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--green">🏪</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total de Encomendas</span>
            <strong>{stats.totalOrders.toLocaleString()}</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--gray">🧾</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Receita Total</span>
            <strong>{stats.totalRevenue.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--green">€</div>
        </div>
      </div>

      <section className="admin-chart-card">
        <div className="admin-chart-header">
          <div>
            <h2>Evolução de Vendas</h2>
            <p>Receita mensal em 2025</p>
          </div>
          <span>↗ +23% vs ano anterior</span>
        </div>

        <div className="admin-fake-chart">
          {stats.monthlyRevenue.length > 0 ? (
            <svg viewBox="0 0 1000 260" preserveAspectRatio="none">
              <polyline
                points={chartPoints}
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
              />
            </svg>
          ) : (
            <div className="admin-chart-empty">Sem dados de vendas.</div>
          )}
        </div>
      </section>

      <div className="admin-tables-grid">
        <section className="admin-table-card">
          <div className="admin-table-header">
            <h2>Encomendas Recentes</h2>
            <a href="#">Ver todas →</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Comprador</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {encomendasRecentes.map((item) => (
                <tr key={item.numero}>
                  <td>{item.numero}</td>
                  <td>{item.comprador}</td>
                  <td><strong>{item.total}</strong></td>
                  <td><span className={badgeClass(item.estado)}>{item.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-table-card">
          <div className="admin-table-header">
            <h2>Utilizadores Recentes</h2>
            <a href="#">Ver todos →</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Perfil</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {utilizadoresRecentes.map((user) => (
                <tr key={user.email}>
                  <td>
                    <strong>{user.nome}</strong>
                    <small>{user.email}</small>
                  </td>
                  <td><span className={badgeClass(user.perfil)}>{user.perfil}</span></td>
                  <td><span className={badgeClass(user.estado)}>{user.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default DashboardAdmin;