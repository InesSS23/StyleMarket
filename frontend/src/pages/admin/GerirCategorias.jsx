function GerirCategorias() {
  const categorias = [
    { id: 1, icone: "👕", nome: "T-shirts", produtos: 156 },
    { id: 2, icone: "🧥", nome: "Casacos", produtos: 89 },
    { id: 3, icone: "👖", nome: "Calças", produtos: 124 },
    { id: 4, icone: "👗", nome: "Vestidos", produtos: 67 },
    { id: 5, icone: "👟", nome: "Sapatilhas", produtos: 203 },
    { id: 6, icone: "🎒", nome: "Acessórios", produtos: 142 },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header admin-page-header-row">
        <div>
          <h1>Gestão de Categorias</h1>
          <p>Cria e gere as categorias de produtos da plataforma.</p>
        </div>

        <button className="admin-primary-button">+ Adicionar Categoria</button>
      </div>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ícone</th>
              <th>Nome</th>
              <th>Produtos</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>#{categoria.id}</td>
                <td className="admin-category-icon">{categoria.icone}</td>
                <td>
                  <strong>{categoria.nome}</strong>
                </td>
                <td>
                  <span className="admin-badge admin-badge--blue">
                    {categoria.produtos} produtos
                  </span>
                </td>
                <td>
                  <div className="admin-action-buttons">
                    <button className="admin-action admin-action--blue">✎</button>
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

export default GerirCategorias;