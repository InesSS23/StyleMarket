function GerirEncomendas() {
  const encomendas = [
    {
      numero: "#1001",
      comprador: "Maria Santos",
      email: "maria@email.com",
      itens: 3,
      total: "104.99€",
      estado: "Concluída",
      data: "28/04/2026",
      avancar: false,
    },
    {
      numero: "#1002",
      comprador: "Carlos Oliveira",
      email: "carlos@email.com",
      itens: 1,
      total: "68.99€",
      estado: "Enviada",
      data: "01/05/2026",
      avancar: true,
    },
    {
      numero: "#1003",
      comprador: "Sofia Rodrigues",
      email: "sofia@email.com",
      itens: 4,
      total: "167.50€",
      estado: "Paga",
      data: "03/05/2026",
      avancar: true,
    },
    {
      numero: "#1004",
      comprador: "Tiago Mendes",
      email: "tiago@email.com",
      itens: 1,
      total: "52.00€",
      estado: "Concluída",
      data: "25/04/2026",
      avancar: false,
    },
    {
      numero: "#1005",
      comprador: "Maria Santos",
      email: "maria@email.com",
      itens: 1,
      total: "38.00€",
      estado: "Pendente",
      data: "08/05/2026",
      avancar: true,
    },
    {
      numero: "#1006",
      comprador: "Ana Ferreira",
      email: "ana@email.com",
      itens: 2,
      total: "87.50€",
      estado: "Cancelada",
      data: "30/04/2026",
      avancar: false,
    },
  ];

  function estadoClass(estado) {
    if (estado === "Concluída") return "admin-badge admin-badge--green";
    if (estado === "Enviada") return "admin-badge admin-badge--blue";
    if (estado === "Paga") return "admin-badge admin-badge--purple";
    if (estado === "Pendente") return "admin-badge admin-badge--yellow";
    if (estado === "Cancelada") return "admin-badge admin-badge--red";
    return "admin-badge admin-badge--gray";
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Encomendas</h1>
        <p>Supervisiona e gere todas as encomendas da plataforma.</p>
      </div>

      <div className="admin-order-summary">
        <span className="admin-order-pill admin-order-pill--yellow">1 Pendente</span>
        <span className="admin-order-pill admin-order-pill--purple">1 Paga</span>
        <span className="admin-order-pill admin-order-pill--blue">1 Enviada</span>
        <span className="admin-order-pill admin-order-pill--green">2 Concluída</span>
        <span className="admin-order-pill admin-order-pill--red">1 Cancelada</span>
      </div>

      <div className="admin-single-filter-card">
        <input
          className="admin-search-input"
          placeholder="Pesquisar por número de encomenda ou comprador..."
        />
      </div>

      <p className="admin-results-text">
        A mostrar {encomendas.length} encomendas
      </p>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Nº Encomenda</th>
              <th>Comprador</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {encomendas.map((encomenda) => (
              <tr key={encomenda.numero}>
                <td>
                  <strong>{encomenda.numero}</strong>
                </td>

                <td>
                  <strong>{encomenda.comprador}</strong>
                  <small>{encomenda.email}</small>
                </td>

                <td>
                  <span className="admin-items-circle">
                    {encomenda.itens}
                  </span>
                </td>

                <td>
                  <strong>{encomenda.total}</strong>
                </td>

                <td>
                  <span className={estadoClass(encomenda.estado)}>
                    {encomenda.estado}
                  </span>
                </td>

                <td>{encomenda.data}</td>

                <td>
                  <div className="admin-order-actions">
                    <button className="admin-details-button">👁 Detalhes</button>

                    {encomenda.avancar && (
                      <button className="admin-next-button">↻ Avançar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default GerirEncomendas;