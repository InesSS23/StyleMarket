function GerirProdutos() {
  //ATUALIZAR IMAGENS DOS PRODUTOS - ALGUMAS IMAGENS ESTÃO REPETIDAS PARA PODER ALINHAR O PROTÓTIPO COM O FIGMA
  const produtos = [
   {
    id: 1,
    imagem: "/images/produtos/tshirt-branca.jpg",
    nome: "T-Shirt Básica Branca",
    categoria: "T-shirts",
    vendedor: "João Silva",
    preco: "19.99€",
    stock: 15,
    estado: "Novo",
  },
  {
    id: 2,
    imagem: "/images/produtos/casaco-denim.jpg",
    nome: "Casaco Denim Vintage",
    categoria: "Casacos",
    vendedor: "Maria Santos",
    preco: "45.00€",
    stock: 8,
    estado: "Usado - Como Novo",
  },
  {
    id: 3,
    imagem: "/images/produtos/calcas-jeans.jpg",
    nome: "Calças Jeans Skinny",
    categoria: "Calças",
    vendedor: "João Silva",
    preco: "35.50€",
    stock: 12,
    estado: "Novo",
  },
  {
    id: 4,
    imagem: "/images/produtos/tshirt-branca.jpg",
    nome: "Vestido Floral Verão",
    categoria: "Vestidos",
    vendedor: "Ana Ferreira",
    preco: "52.00€",
    stock: 5,
    estado: "Novo",
  },
  {
    id: 5,
    imagem: "/images/produtos/casaco-denim.jpg",
    nome: "Sapatilhas Desportivas",
    categoria: "Sapatilhas",
    vendedor: "Maria Santos",
    preco: "68.99€",
    stock: 20,
    estado: "Novo",
  },
  {
    id: 6,
    imagem: "/images/produtos/calcas-jeans.jpg",
    nome: "Mochila Urban Style",
    categoria: "Acessórios",
    vendedor: "Ana Ferreira",
    preco: "29.90€",
    stock: 10,
    estado: "Novo",
  },
  {
    id: 7,
    imagem: "/images/produtos/tshirt-branca.jpg",
    nome: "Sweater Oversized",
    categoria: "Casacos",
    vendedor: "João Silva",
    preco: "38.00€",
    stock: 7,
    estado: "Novo",
  },
  {
    id: 8,
    imagem: "/images/produtos/casaco-denim.jpg",
    nome: "Camisa Linho Rosa",
    categoria: "T-shirts",
    vendedor: "Ana Ferreira",
    preco: "42.50€",
    stock: 6,
    estado: "Novo",
  },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Gestão de Produtos</h1>
        <p>Gere todos os produtos publicados na plataforma.</p>
      </div>

      <div className="admin-products-filter-card">
        <input className="admin-search-input" placeholder="Pesquisar por nome ou marca..." />

        <select className="admin-select">
          <option>Todas as Categorias</option>
          <option>T-shirts</option>
          <option>Casacos</option>
          <option>Calças</option>
          <option>Vestidos</option>
          <option>Sapatilhas</option>
          <option>Acessórios</option>
        </select>

        <select className="admin-select">
          <option>Todos os Vendedores</option>
          <option>João Silva</option>
          <option>Maria Santos</option>
          <option>Ana Ferreira</option>
        </select>

        <select className="admin-select">
          <option>Todos os Estados</option>
          <option>Novo</option>
          <option>Usado - Como Novo</option>
          <option>Usado - Bom Estado</option>
        </select>
      </div>

      <p className="admin-results-text">
        A mostrar {produtos.length} produtos
      </p>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Vendedor</th>
              <th>Preço</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>#{produto.id}</td>

                <td>
                  <div className="admin-product-cell">
                    <img src={produto.imagem} alt={produto.nome} />
                    <strong>{produto.nome}</strong>
                  </div>
                </td>

                <td>{produto.categoria}</td>
                <td>{produto.vendedor}</td>
                <td><strong>{produto.preco}</strong></td>
                <td>{produto.stock}</td>

                <td>
                  <span className="admin-badge admin-badge--green">
                    {produto.estado}
                  </span>
                </td>

                <td>
                  <div className="admin-action-buttons">
                    <button className="admin-action admin-action--blue">👁</button>
                    <button className="admin-action admin-action--dark">✎</button>
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

export default GerirProdutos;