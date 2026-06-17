function GerirUtilizadores() {
  const utilizadores = [
    { id: 1, inicial: "J", nome: "João Silva", email: "joao@email.com", perfil: "Vendedor", estado: "Ativo", data: "15/01/2025" },
    { id: 2, inicial: "M", nome: "Maria Santos", email: "maria@email.com", perfil: "Comprador", estado: "Ativo", data: "20/02/2025" },
    { id: 3, inicial: "P", nome: "Pedro Costa", email: "pedro@email.com", perfil: "Vendedor", estado: "Ativo", data: "10/03/2025" },
    { id: 4, inicial: "A", nome: "Ana Ferreira", email: "ana@email.com", perfil: "Vendedor", estado: "Ativo", data: "05/11/2024" },
    { id: 5, inicial: "C", nome: "Carlos Oliveira", email: "carlos@email.com", perfil: "Comprador", estado: "Inativo", data: "01/04/2025" },
    { id: 6, inicial: "S", nome: "Sofia Rodrigues", email: "sofia@email.com", perfil: "Comprador", estado: "Ativo", data: "02/05/2025" },
    { id: 7, inicial: "A", nome: "Admin StyleMarket", email: "admin@stylemarket.com", perfil: "Administrador", estado: "Ativo", data: "01/01/2024" },
  ];

  function perfilClass(perfil) {
    if (perfil === "Vendedor") return "admin-badge admin-badge--blue";
    if (perfil === "Administrador") return "admin-badge admin-badge--purple";
    return "admin-badge admin-badge--gray";
  }

  function estadoClass(estado) {
    if (estado === "Ativo") return "admin-badge admin-badge--green";
    return "admin-badge admin-badge--gray";
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Utilizadores</h1>
        <p>Gere todos os utilizadores registados na plataforma.</p>
      </div>

      <div className="admin-filter-card">
        <input
          type="text"
          placeholder="Pesquisar por nome ou email..."
          className="admin-search-input"
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
        />

        <select className="admin-select">
          <option>Todos os Perfis</option>
          <option>Administrador</option>
          <option>Vendedor</option>
          <option>Comprador</option>
        </select>
      </div>

      <p className="admin-results-text">
        A mostrar {utilizadores.length} utilizadores
      </p>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Estado</th>
              <th>Data de Registo</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {utilizadores.map((user) => (
              <tr key={user.id}>
                <td>#{user.id}</td>

                <td>
                  <div className="admin-user-cell">
                    <span className="admin-avatar">{user.inicial}</span>
                    <span>{user.nome}</span>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span className={perfilClass(user.perfil)}>
                    {user.perfil}
                  </span>
                </td>

                <td>
                  <span className={estadoClass(user.estado)}>
                    {user.estado}
                  </span>
                </td>

                <td>{user.data}</td>

                <td>
                  <div className="admin-action-buttons">
                    <button className="admin-action admin-action--blue">👁</button>
                    <button className="admin-action admin-action--dark">✎</button>
                    <button className="admin-action admin-action--yellow">⊘</button>
                    <button className="admin-action admin-action--red">🗑</button>
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

export default GerirUtilizadores;