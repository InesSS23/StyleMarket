function DashboardAdmin() {
  const encomendasRecentes = [
    { numero: "#1001", comprador: "Maria Santos", total: "104.99€", estado: "Concluída" },
    { numero: "#1002", comprador: "Carlos Oliveira", total: "68.99€", estado: "Enviada" },
    { numero: "#1003", comprador: "Sofia Rodrigues", total: "167.50€", estado: "Paga" },
    { numero: "#1004", comprador: "Tiago Mendes", total: "52.00€", estado: "Concluída" },
    { numero: "#1005", comprador: "Maria Santos", total: "38.00€", estado: "Pendente" },
  ];

  const utilizadoresRecentes = [
    { nome: "João Silva", email: "joao@email.com", perfil: "Vendedor", estado: "Ativo" },
    { nome: "Maria Santos", email: "maria@email.com", perfil: "Comprador", estado: "Ativo" },
    { nome: "Pedro Costa", email: "pedro@email.com", perfil: "Vendedor", estado: "Ativo" },
    { nome: "Ana Ferreira", email: "ana@email.com", perfil: "Vendedor", estado: "Ativo" },
    { nome: "Carlos Oliveira", email: "carlos@email.com", perfil: "Comprador", estado: "Inativo" },
  ];

  function badgeClass(estado) {
    if (estado === "Concluída" || estado === "Ativo") return "admin-badge admin-badge--green";
    if (estado === "Enviada" || estado === "Vendedor") return "admin-badge admin-badge--blue";
    if (estado === "Paga") return "admin-badge admin-badge--purple";
    if (estado === "Pendente") return "admin-badge admin-badge--yellow";
    return "admin-badge admin-badge--gray";
  }

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
            <strong>1.247</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--blue">👥</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total de Produtos</span>
            <strong>3.542</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--purple">📦</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total de Vendedores</span>
            <strong>3</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--green">🏪</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total de Encomendas</span>
            <strong>8.923</strong>
          </div>
          <div className="admin-stat-icon admin-stat-icon--gray">🧾</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Receita Total</span>
            <strong>247.8K€</strong>
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
          <svg viewBox="0 0 1000 260" preserveAspectRatio="none">
            <polyline
              points="0,190 90,175 180,178 270,150 360,160 450,130 540,138 630,110 720,120 810,90 900,70 1000,35"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
            />
          </svg>
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